import { AccessToken, ClientSecretCredential } from '@azure/identity';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
  Client,
} from '@microsoft/microsoft-graph-client';
import { Organization } from '@microsoft/microsoft-graph-types';
import 'isomorphic-unfetch';

import { ClientConfig } from './types';

export type QueryParams = string | { [key: string]: string | number };

/**
 * Pagination: https://docs.microsoft.com/en-us/graph/paging
 * Throttling with retry after: https://docs.microsoft.com/en-us/graph/throttling
 * Batching requests: https://docs.microsoft.com/en-us/graph/json-batching
 */
export class GraphClient {
  protected client: Client;

  constructor(
    readonly logger: IntegrationLogger,
    readonly config: ClientConfig,
  ) {
    this.client = Client.initWithMiddleware({
      authProvider: new GraphAuthenticationProvider(config),
    });
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      await this.client.api('/organization').get();
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: '/organization',
        status: err.statusCode,
        statusText: err.code,
      });
    }
  }

  public async fetchMetadata(): Promise<object> {
    return this.client.api('/').get();
  }

  /**
   * Fetch organization details. Throws an error when this cannot be
   * accomplished.
   */
  public async fetchOrganization(): Promise<Organization> {
    try {
      const response = await this.client.api('/organization').get();
      return response.value[0];
    } catch (err) {
      const errorOptions = {
        cause: err,
        endpoint: '/organization',
        status: err.statusCode,
        statusText: err.code,
      };
      if (err.statusCode === 401) {
        throw new IntegrationProviderAuthorizationError(errorOptions);
      } else {
        throw new IntegrationProviderAPIError(errorOptions);
      }
    }
  }

  // Not using PageIterator because it doesn't allow async callback
  /**
   * Iterate resources. 401 Unauthorized, 403 Forbidden, and 404 Not Found
   * responses are considered empty collections. Other API errors will be
   * thrown.
   */
  protected async iterateResources<T>({
    resourceUrl,
    query,
    callback,
  }: {
    resourceUrl: string;
    query?: QueryParams;
    callback: (item: T) => void | Promise<void>;
  }): Promise<void> {
    let nextLink: string | undefined = resourceUrl;
    let retries = 0;
    do {
      try {
        nextLink = await this.callApi<T>({
          link: nextLink,
          query,
          callback,
        });
      } catch (err) {
        if (
          err.message ===
            'CompactToken parsing failed with error code: 80049217' &&
          nextLink &&
          retries < 5
        ) {
          // Retry a few times to handle sporatic timing issue with this sdk - https://github.com/OneDrive/onedrive-api-docs/issues/785
          retries++;
          continue;
        } else {
          nextLink = undefined;
          this.handleApiError(err, resourceUrl);
        }
      }
    } while (nextLink);
  }

  private async callApi<T>({
    link,
    query,
    callback,
  }: {
    link: string;
    query?: QueryParams;
    callback: (item: T) => void | Promise<void>;
  }): Promise<string | undefined> {
    let api = this.client.api(link);
    if (query) {
      api = api.query(query);
    }

    const response = await api.get();
    if (response) {
      for (const value of response.value) {
        await callback(value);
      }
      return response['@odata.nextLink'];
    }
  }

  private handleApiError(err: any, resourceUrl: string) {
    {
      if (err.statusCode === 401) {
        this.logger.info({ resourceUrl }, 'Unauthorized');
      } else if (err.statusCode === 403) {
        this.logger.info({ resourceUrl }, 'Forbidden');
      } else if (err.statusCode !== 404) {
        throw new IntegrationProviderAPIError({
          cause: err,
          endpoint: resourceUrl,
          status: err.statusCode,
          statusText: err.statusText || err.code || err.message,
        });
      }
    }
  }
}

class GraphAuthenticationProvider implements AuthenticationProvider {
  private accessToken: AccessToken | null;

  constructor(readonly config: ClientConfig) {}

  /**
   * Obtains an accessToken (in case of success) or rejects with error (in case
   * of failure). Refreshes token when it is approaching expiration.
   */
  public async getAccessToken(
    options?: AuthenticationProviderOptions,
  ): Promise<string> {
    if (
      !this.accessToken ||
      this.accessToken.expiresOnTimestamp - Date.now() < 1000 * 60
    ) {
      const credentials = new ClientSecretCredential(
        this.config.tenant,
        this.config.clientId,
        this.config.clientSecret,
      );
      const scopes = options?.scopes || 'https://graph.microsoft.com/.default';
      this.accessToken = await credentials.getToken(scopes);
    }
    if (!this.accessToken) {
      throw new Error(
        'Authentication cannot be peformed at this time, no reason provided by Microsoft identity platform.',
      );
    } else {
      return this.accessToken.token;
    }
  }
}
