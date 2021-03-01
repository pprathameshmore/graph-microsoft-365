import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchNonComplianceFindings } from '..';
import { fetchDevices } from '../../devices';
import { fetchDeviceConfigurations } from '../../deviceConfigurations';
import { entities, relationships } from '../../../constants';
import { Entity } from '@jupiterone/integration-sdk-core';
import { isEqual } from 'lodash';
import { ensureArray } from '../../../../../../test/ensureArray';

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

    const noncomplianceFindingEntities = context.jobState.collectedEntities.filter(
      (e) =>
        isEqual(e._class, ensureArray(entities.NONCOMPLIANCE_FINDING._class)),
    );
    const noncomplianceFindingDeviceRelationships = context.jobState.collectedRelationships.filter(
      (r) =>
        isEqual(r._type, relationships.DEVICE_USES_DEVICE_CONFIGURATION._type),
    );
    const noncomplianceFindingDeviceConfigurationRelationships = context.jobState.collectedRelationships.filter(
      (r) =>
        isEqual(
          r._type,
          relationships.DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING
            ._type,
        ),
    );
    const deviceDeviceConfigurationRelationships = context.jobState.collectedRelationships.filter(
      (r) =>
        isEqual(r._type, relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING._type),
    );

    // Check that we have Noncompliance Findings
    expect(noncomplianceFindingEntities.length).toBeGreaterThan(0);
    expect(noncomplianceFindingEntities).toMatchGraphObjectSchema({
      _class: entities.NONCOMPLIANCE_FINDING._class,
    });
    expect(noncomplianceFindingEntities).toMatchSnapshot();
    // Check that only open findings are created
    noncomplianceFindingEntities.forEach((entity: Entity) => {
      expect(entity.open).toBe(true);
    });

    // Check that we have DEVICE_USES_DEVICE_CONFIGURATION relationships
    expect(noncomplianceFindingDeviceRelationships.length).toBeGreaterThan(0);
    expect(
      noncomplianceFindingDeviceRelationships,
    ).toMatchDirectRelationshipSchema({});
    expect(noncomplianceFindingDeviceRelationships).toMatchSnapshot(
      'noncomplianceFindingDeviceRelationships',
    );

    // Check that we have DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING relationships
    expect(
      noncomplianceFindingDeviceConfigurationRelationships.length,
    ).toBeGreaterThan(0);
    expect(
      noncomplianceFindingDeviceConfigurationRelationships,
    ).toMatchDirectRelationshipSchema({});
    expect(
      noncomplianceFindingDeviceConfigurationRelationships,
    ).toMatchSnapshot('noncomplianceFindingDeviceConfigurationRelationships');

    // Check that we have DEVICE_HAS_NONCOMPLIANCE_FINDING relationships
    expect(deviceDeviceConfigurationRelationships.length).toBeGreaterThan(0);
    expect(
      deviceDeviceConfigurationRelationships,
    ).toMatchDirectRelationshipSchema({});
    expect(deviceDeviceConfigurationRelationships).toMatchSnapshot(
      'deviceDeviceConfigurationRelationships',
    );
  });
});
