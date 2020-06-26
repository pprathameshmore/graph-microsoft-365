import {
  createMockIntegrationLogger,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import config from '../../../test/config';
import { setupAzureRecording } from '../../../test/recording';
import { GraphClient } from '../client';

const logger = createMockIntegrationLogger();

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('authentication', () => {
  test('token fetch', async () => {
    recording = setupAzureRecording({ directory: __dirname, name: 'getToken' });

    const client = new GraphClient(logger, config);

    const metadata = await client.fetchMetadata();
    expect(metadata).toMatchObject({
      '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata',
    });
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

  test('forbidden', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchOrganization403',
      options: {
        recordFailedRequests: true,
      },
    });

    // recording.server
    //   .get('https://graph.microsoft.com/v1.0/organization')
    //   .intercept((req, res) => {
    //     res.sendStatus(403);
    //   });
    const client = new GraphClient(logger, config);

    const organization = await client.fetchOrganization();

    expect(organization).toMatchObject({
      displayName: expect.any(String),
    });
  });
});
