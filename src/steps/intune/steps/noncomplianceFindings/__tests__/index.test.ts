import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchNonComplianceFindings } from '..';
import { fetchDevices } from '../../devices';
import { fetchDeviceConfigurations } from '../../deviceConfigurations';
import { entities } from '../../../constants';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetchNonComplianceFindings', () => {
  test('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchNonComplianceFindings',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchDevices(context);
    await fetchDeviceConfigurations(context);
    await fetchNonComplianceFindings(context);

    const deviceConfiguration = context.jobState.collectedEntities.filter(
      (e) => {
        return e._class.includes('Finding');
      },
    );
    const noncomplianceFindingDeviceRelationships = context.jobState.collectedRelationships.filter(
      (r) => {
        return r._type.includes(entities.NONCOMPLIANCE_FINDING._type);
      },
    );
    const noncomplianceFindingDeviceConfigurationRelationships = context.jobState.collectedRelationships.filter(
      (r) => {
        return r._type.includes(entities.NONCOMPLIANCE_FINDING._type);
      },
    );
    const deviceDeviceConfigurationRelationships = context.jobState.collectedRelationships.filter(
      (r) => {
        return (
          r._type.includes(entities.DEVICE._type) &&
          r._type.includes(entities.DEVICE_CONFIGURATION._type)
        );
      },
    );

    // Check that we have Noncompliance Findings
    expect(deviceConfiguration.length).toBeGreaterThan(0);
    expect(deviceConfiguration).toMatchGraphObjectSchema({
      _class: ['Finding'],
    });

    // Check that we have DEVICE_USES_DEVICE_CONFIGURATION relationships
    expect(deviceConfiguration.length).toBeGreaterThan(0);
    expect(
      noncomplianceFindingDeviceRelationships,
    ).toMatchDirectRelationshipSchema({});

    // Check that we have DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING relationships
    expect(deviceConfiguration.length).toBeGreaterThan(0);
    expect(
      noncomplianceFindingDeviceConfigurationRelationships,
    ).toMatchDirectRelationshipSchema({});

    // Check that we have DEVICE_HAS_NONCOMPLIANCE_FINDING relationships
    expect(deviceConfiguration.length).toBeGreaterThan(0);
    expect(
      deviceDeviceConfigurationRelationships,
    ).toMatchDirectRelationshipSchema({});
  });
});
