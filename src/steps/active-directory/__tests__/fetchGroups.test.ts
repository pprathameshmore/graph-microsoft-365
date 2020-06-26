import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import { fetchGroups } from '../';
import config from '../../../../test/config';
import { setupAzureRecording } from '../../../../test/recording';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetchGroups', async () => {
  recording = setupAzureRecording({
    directory: __dirname,
    name: 'fetchGroups',
  });

  const context = createMockStepExecutionContext({ instanceConfig: config });

  await fetchGroups(context);

  expect(context.jobState.collectedEntities).toHaveLength(3);
  expect(context.jobState.collectedRelationships).toHaveLength(0);

  expect(context.jobState.collectedEntities).toEqual([
    expect.objectContaining({
      _key: 'trend-micro-computer:1',
    }),
    expect.objectContaining({
      _key: 'trend-micro-computer:34',
    }),
    expect.objectContaining({
      _key: 'trend-micro-computer:35',
    }),
  ]);
});
