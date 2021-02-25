import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchDevices } from '..';
import { entities } from '../constants';
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

    const managedDevices = context.jobState.collectedEntities.filter((e) => {
      return e._class.includes('Device');
    });
    const managedDeviceRelationships = context.jobState.collectedRelationships.filter(
      (r) => {
        return r._type.includes(entities.DEVICE._type);
      },
    );

    // Check that we have devices
    expect(managedDevices.length).toBeGreaterThan(0);
    expect(managedDevices).toMatchGraphObjectSchema({
      _class: ['Device'],
    });

    // Check that relationship is mapped
    expect(managedDeviceRelationships.length).toBeGreaterThan(0);
    managedDeviceRelationships.forEach((r) =>
      expect(r).toMatchObject({
        _mapping: expect.any(Object),
      }),
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

    const managedDevices = context.jobState.collectedEntities.filter((e) => {
      return e._class.includes('Device');
    });
    const managedDeviceRelationships = context.jobState.collectedRelationships.filter(
      (r) => {
        return r._type.includes(entities.DEVICE._type);
      },
    );

    // Check that we have devices
    expect(managedDevices.length).toBeGreaterThan(0);
    expect(managedDevices).toMatchGraphObjectSchema({
      _class: ['Device'],
    });

    // Check that relationship is direct
    expect(managedDeviceRelationships.length).toBeGreaterThan(0);
    expect(managedDeviceRelationships).toMatchDirectRelationshipSchema({});
  });
});
