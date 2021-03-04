import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchDevices } from '../../devices';
import { entities, relationships } from '../../../constants';
import { isEqual } from 'lodash';
import { toArray } from '../../../../../utils/toArray';
import { fetchDetectedApplications, fetchManagedApplications } from '..';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetchManagedApplications', () => {
  test('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchManagedApplications',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchDevices(context);
    await fetchManagedApplications(context);

    const managedApplicationEntities = context.jobState.collectedEntities.filter(
      (e) => isEqual(e._class, toArray(entities.MANAGED_APPLICATION._class)),
    );
    const deviceApplicationRelationships = context.jobState.collectedRelationships.filter(
      (r) =>
        isEqual(
          r._type,
          relationships.DEVICE_ASSIGNED_MANAGED_APPLICATION._type,
        ),
    );

    // Check that we have Managed Applications
    expect(managedApplicationEntities.length).toBeGreaterThan(0);
    expect(managedApplicationEntities).toMatchGraphObjectSchema({
      _class: entities.MANAGED_APPLICATION._class,
    });
    expect(managedApplicationEntities).toMatchSnapshot(
      'managedApplicationEntities',
    );

    // Check that we have DEVICE_ASSIGNED_MANAGED_APPLICATION relationships
    expect(deviceApplicationRelationships.length).toBeGreaterThan(0);
    expect(deviceApplicationRelationships).toMatchDirectRelationshipSchema({});
    expect(deviceApplicationRelationships).toMatchSnapshot(
      'deviceManagedApplicationRelationships',
    );
  });
});

describe('fetchDetectedApplications', () => {
  test('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchDetectedApplications',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchDevices(context);
    await fetchDetectedApplications(context);

    const detectedApplicationEntities = context.jobState.collectedEntities.filter(
      (e) => isEqual(e._class, toArray(entities.DETECTED_APPLICATION._class)),
    );
    const deviceApplicationRelationships = context.jobState.collectedRelationships.filter(
      (r) =>
        isEqual(r._type, relationships.DEVICE_HAS_DETECTED_APPLICATION._type),
    );

    // Check that we have Detected Applications
    expect(detectedApplicationEntities.length).toBeGreaterThan(0);
    expect(detectedApplicationEntities).toMatchGraphObjectSchema({
      _class: entities.DETECTED_APPLICATION._class,
    });
    expect(detectedApplicationEntities).toMatchSnapshot(
      'detectedApplicationEntities',
    );

    // Check that we have DEVICE_ASSIGNED_DETECTED_APPLICATION relationships
    expect(deviceApplicationRelationships.length).toBeGreaterThan(0);
    expect(deviceApplicationRelationships).toMatchDirectRelationshipSchema({});
    expect(deviceApplicationRelationships).toMatchSnapshot(
      'deviceDetecctedApplicationRelationships',
    );
  });
});
