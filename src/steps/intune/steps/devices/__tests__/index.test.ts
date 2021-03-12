import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchDevices } from '..';
import { managedDeviceTypes } from '../../../constants';
import { fetchAccount, fetchUsers } from '../../../../active-directory';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetchDevices', () => {
  test('Without Active Directory', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'iterateManagedDevicesNoAD',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchDevices(context);

    const managedDevices = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Host'),
    );
    const managedDeviceRelationships = context.jobState.collectedRelationships.filter(
      (r) => managedDeviceTypes.some((type) => r._type.includes(type)),
    );

    // Check that we have devices
    expect(managedDevices.length).toBeGreaterThan(0);
    expect(managedDevices.filter((d) => d.physical)).toMatchGraphObjectSchema({
      _class: ['Host', 'Device'],
    });
    expect(managedDevices.filter((d) => !d.physical)).toMatchGraphObjectSchema({
      _class: ['Host'],
    });
    expect(managedDevices).toMatchSnapshot('managedDevices'); // intentionally the same snapshot as in the 'With Active Directory' test below

    // Check that relationship is mapped
    expect(managedDeviceRelationships.length).toBeGreaterThan(0);
    managedDeviceRelationships.forEach((r) =>
      expect(r).toMatchObject({
        _mapping: expect.any(Object),
      }),
    );
    expect(managedDeviceRelationships).toMatchSnapshot(
      'managedDeviceRelationshipsNoAD',
    );
  });

  test('With Active Directory', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'iterateManagedDevicesWithAD',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchAccount(context);
    await fetchUsers(context);
    await fetchDevices(context);

    const managedDevices = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Host'),
    );
    const managedDeviceRelationships = context.jobState.collectedRelationships.filter(
      (r) => managedDeviceTypes.some((type) => r._type.includes(type)),
    );

    // Check that we have devices
    expect(managedDevices.length).toBeGreaterThan(0);
    expect(managedDevices.filter((d) => d.physical)).toMatchGraphObjectSchema({
      _class: ['Host', 'Device'],
    });
    expect(managedDevices.filter((d) => !d.physical)).toMatchGraphObjectSchema({
      _class: ['Host'],
    });
    expect(managedDevices).toMatchSnapshot('managedDevices'); // intentionally the same snapshot as in the 'Without Active Directory' test above

    // Check that relationship is direct
    expect(managedDeviceRelationships.length).toBeGreaterThan(0);
    expect(managedDeviceRelationships).toMatchDirectRelationshipSchema({});
    expect(managedDeviceRelationships).toMatchSnapshot(
      'managedDeviceRelationshipsWithAD',
    );
  });
});
