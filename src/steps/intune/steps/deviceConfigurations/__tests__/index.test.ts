import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchDeviceConfigurations, isOrphanedConfig } from '..';
import { entities } from '../../../constants';
import { DeviceConfiguration } from '@microsoft/microsoft-graph-types-beta';
import { DeviceConfigurationDeviceOverview } from '@microsoft/microsoft-graph-types';

describe('fetchDeviceConfigurations', () => {
  let recording: Recording;
  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchDeviceConfigurations',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchDeviceConfigurations(context);

    const deviceConfigurationEntities = context.jobState.collectedEntities;

    // Check that we have configurations
    expect(deviceConfigurationEntities.length).toBeGreaterThan(0);

    // Check that we have only ingested Device Configurationsd
    deviceConfigurationEntities.forEach((configuration) => {
      expect(configuration._type).toBe(entities.DEVICE_CONFIGURATION._type);
    });

    // Check that there are no orphaned configurations
    deviceConfigurationEntities.forEach((configuration) => {
      expect(
        isOrphanedConfig(
          ((configuration._rawData as unknown) as {
            rawData: DeviceConfiguration & {
              deviceStatusOverview: DeviceConfigurationDeviceOverview;
            };
          }[])[0].rawData.deviceStatusOverview,
        ),
      ).toBe(false);
    });

    // Check that the schema is correct
    expect(deviceConfigurationEntities).toMatchGraphObjectSchema({
      _class: entities.DEVICE_CONFIGURATION._class,
    });

    expect(deviceConfigurationEntities).toMatchSnapshot(
      'deviceConfigurationEntities',
    );
  });
});
