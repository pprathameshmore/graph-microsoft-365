import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchDeviceConfigurations } from '..';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetchDeviceConfigurations', () => {
  test('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchDeviceConfigurations',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchDeviceConfigurations(context);
    const deviceConfiguration = context.jobState.collectedEntities.filter(
      (e) => {
        return e._class.includes('Configuration');
      },
    );

    // Check that we have configurations
    expect(deviceConfiguration.length).toBeGreaterThan(0);
    expect(deviceConfiguration).toMatchGraphObjectSchema({
      _class: ['Configuration'],
    });
  });
});
