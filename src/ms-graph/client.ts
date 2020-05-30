import { AccessToken, ClientSecretCredential } from '@azure/identity';
import { IntegrationLogger } from '@jupiterone/integration-sdk';
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
      console.log(scopes);
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
