import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchDeviceConfigurationsAndFindings } from '..';
import { fetchDevices } from '../../devices';
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

describe('fetchDeviceConfigurationsAndFindings', () => {
  test('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchDeviceConfigurationsAndFindings',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchDevices(context);
    await fetchDeviceConfigurationsAndFindings(context);

    const deviceConfigEntities = context.jobState.collectedEntities.filter(
      (e) =>
        isEqual(e._class, ensureArray(entities.DEVICE_CONFIGURATION._class)),
    );
    const noncomplianceFindingEntities = context.jobState.collectedEntities.filter(
      (e) =>
        isEqual(e._class, ensureArray(entities.NONCOMPLIANCE_FINDING._class)),
    );
    const deviceDeviceConfigRelationships = context.jobState.collectedRelationships.filter(
      (r) =>
        isEqual(r._type, relationships.DEVICE_USES_DEVICE_CONFIGURATION._type),
    );
    const deviceConfigFindingRelationships = context.jobState.collectedRelationships.filter(
      (r) =>
        isEqual(
          r._type,
          relationships.DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING
            ._type,
        ),
    );
    const deviceFindingRelationships = context.jobState.collectedRelationships.filter(
      (r) =>
        isEqual(r._type, relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING._type),
    );

    // Check that we have Device Configurations
    expect(deviceConfigEntities.length).toBeGreaterThan(0);
    expect(deviceConfigEntities).toMatchGraphObjectSchema({
      _class: entities.DEVICE_CONFIGURATION._class,
    });
    expect(deviceConfigEntities).toMatchSnapshot('deviceConfigurationEntities');
    // Check that there are no orphaned Device Configuraitons
    deviceConfigEntities.forEach((configEntity) => {
      expect(
        deviceDeviceConfigRelationships.find((r) =>
          r._key.includes(configEntity._key),
        ),
      ).toBeTruthy();
    });

    // Check that we have Noncompliance Findings
    expect(noncomplianceFindingEntities.length).toBeGreaterThan(0);
    expect(noncomplianceFindingEntities).toMatchGraphObjectSchema({
      _class: entities.NONCOMPLIANCE_FINDING._class,
    });
    expect(noncomplianceFindingEntities).toMatchSnapshot(
      'noncomplianceFindingEntities',
    );
    // Check that only open findings are created
    noncomplianceFindingEntities.forEach((entity: Entity) => {
      expect(entity.open).toBe(true);
    });

    // Check that we have DEVICE_USES_DEVICE_CONFIGURATION relationships
    expect(deviceDeviceConfigRelationships.length).toBeGreaterThan(0);
    expect(deviceDeviceConfigRelationships).toMatchDirectRelationshipSchema({});
    expect(deviceDeviceConfigRelationships).toMatchSnapshot(
      'noncomplianceFindingDeviceRelationships',
    );

    // Check that we have DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING relationships
    expect(deviceConfigFindingRelationships.length).toBeGreaterThan(0);
    expect(deviceConfigFindingRelationships).toMatchDirectRelationshipSchema(
      {},
    );
    expect(deviceConfigFindingRelationships).toMatchSnapshot(
      'noncomplianceFindingDeviceConfigurationRelationships',
    );

    // Check that we have DEVICE_HAS_NONCOMPLIANCE_FINDING relationships
    expect(deviceFindingRelationships.length).toBeGreaterThan(0);
    expect(deviceFindingRelationships).toMatchDirectRelationshipSchema({});
    expect(deviceFindingRelationships).toMatchSnapshot(
      'deviceDeviceConfigurationRelationships',
    );
  });
});
