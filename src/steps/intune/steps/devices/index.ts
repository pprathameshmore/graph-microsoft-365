import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import { steps as activeDirectorySteps } from '../../../active-directory';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { relationships, entities, steps } from './constants';
import {
  createManagedDeviceEntity,
  createUserDeviceDirectRelationship,
  createUserDeviceMappedRelationship,
} from './converters';

export async function fetchDevices(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );

  await intuneClient.iterateManagedDevices(async (device) => {
    const deviceEntity = createManagedDeviceEntity(device);
    await jobState.addEntity(deviceEntity);
    const userEntity = await jobState.findEntity(device.userId as string);
    const userDeviceRelationship = userEntity
      ? createUserDeviceDirectRelationship(deviceEntity, userEntity)
      : createUserDeviceMappedRelationship(
          deviceEntity,
          device.userId as string,
          device.emailAddress as string,
        );
    if (userDeviceRelationship) {
      await jobState.addRelationship(userDeviceRelationship);
    }
  });
}

export const deviceSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_DEVICES,
    name: 'Managed Devices',
    entities: [entities.DEVICE],
    relationships: [relationships.USER_HAS_DEVICE],
    dependsOn: [activeDirectorySteps.FETCH_USERS],
    executionHandler: fetchDevices,
  },
];
