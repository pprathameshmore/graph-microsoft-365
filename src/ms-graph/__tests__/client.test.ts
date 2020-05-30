import {
  createMockIntegrationLogger,
  Recording,
} from '@jupiterone/integration-sdk/testing';

import { GraphClient } from '../client';
import { setupAzureRecording } from './recording';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('authentication', () => {
  test('token fetch', async () => {
    recording = setupAzureRecording({ directory: __dirname, name: 'getToken' });

    const client = new GraphClient(createMockIntegrationLogger(), {
      clientId: process.env.CLIENT_ID || 'clientId',
      clientSecret: process.env.CLIENT_SECRET || 'clientSecret',
      directoryId:
        process.env.DIRECTORY_ID || 'a76fc728-0cba-45f0-a9eb-d45207e14513',
    });

    const metadata = await client.fetchMetadata();
    expect(metadata).toMatchObject({
      '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata',
    });
  });
});
