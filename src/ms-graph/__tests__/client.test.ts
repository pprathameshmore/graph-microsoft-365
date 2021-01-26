import {
  createMockIntegrationLogger,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import { config, inaccessibleDirectoryConfig } from '../../../test/config';
import { setupAzureRecording } from '../../../test/recording';
import { GraphClient } from '../client';

const logger = createMockIntegrationLogger();

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('verifyAuthentication', () => {
  test('invalid directoryId', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'verifyAuthenticationInvalidDirectory',
      options: { recordFailedRequests: true },
    });

    const client = new GraphClient(logger, {
      ...config,
      directoryId: 'abc123testing',
    });

    await expect(client.verifyAuthentication()).rejects.toThrow(
      'Provider authentication failed at /organization: -1 AuthenticationError',
    );
  });

  test('inaccesible', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'verifyAuthenticationInaccesibleDirectory',
      options: { recordFailedRequests: true },
    });

    const client = new GraphClient(logger, inaccessibleDirectoryConfig);

    await expect(client.verifyAuthentication()).rejects.toThrow(
      'Provider authentication failed at /organization: 401 Authorization_IdentityNotFound',
    );
  });

  test('accesible', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'verifyAuthentication',
      options: { recordFailedRequests: true },
    });

    const client = new GraphClient(logger, config);

    await expect(client.verifyAuthentication()).resolves.not.toThrowError();
  });
});

test('fetchMetadata', async () => {
  recording = setupAzureRecording({
    directory: __dirname,
    name: 'fetchMetadata',
  });

  const client = new GraphClient(logger, config);

  const metadata = await client.fetchMetadata();
  expect(metadata).toMatchObject({
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata',
  });
});

describe('fetchOrganization', () => {
  test('accessible', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchOrganization',
    });

    const client = new GraphClient(logger, config);

    const organization = await client.fetchOrganization();

    expect(organization).toMatchObject({
      displayName: expect.any(String),
    });
  });

  test('inaccessible', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchOrganizationInaccessible',
      options: {
        recordFailedRequests: true,
      },
    });

    const client = new GraphClient(logger, inaccessibleDirectoryConfig);

    await expect(client.fetchOrganization()).rejects.toThrow(
      'Provider authorization failed at /organization: 401 Authorization_IdentityNotFound',
    );
  });
});
