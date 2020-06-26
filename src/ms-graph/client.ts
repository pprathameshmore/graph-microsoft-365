import { AccessToken, ClientSecretCredential } from '@azure/identity';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';
import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
  Client,
} from '@microsoft/microsoft-graph-client';
import { Organization } from '@microsoft/microsoft-graph-types';

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

  public async fetchMetadata(): Promise<object> {
    return this.client.api('/').get();
  }

  public async fetchOrganization(): Promise<Organization> {
    const response = await this.client.api('/organization').get();
    return response.value[0];
  }

  // Not using PageIterator because it doesn't allow async callback
  protected async iterateResources<T>({
    resourceUrl,
    query,
    callback,
  }: {
    resourceUrl: string;
    query?: QueryParams;
    callback: (item: T) => void | Promise<void>;
  }): Promise<void> {
    try {
      let nextLink: string | undefined;
      do {
        let api = this.client.api(nextLink || resourceUrl);
        if (query) {
          api = api.query(query);
        }

        const response = await api.get();
        if (response) {
          nextLink = response['@odata.nextLink'];
          for (const value of response.value) {
            await callback(value);
          }
        } else {
          nextLink = undefined;
        }
      } while (nextLink);
    } catch (err) {
      if (err.statusCode === 403) {
        this.logger.info({ resourceUrl }, 'Forbidden');
      } else if (err.statusCode !== 404) {
        throw new IntegrationProviderAPIError({
          cause: err,
          endpoint: resourceUrl,
          status: err.statusCode,
          statusText: err.statusText || err.message,
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
        this.config.directoryId,
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
