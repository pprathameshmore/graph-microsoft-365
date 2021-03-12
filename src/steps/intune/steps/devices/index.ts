import {
  createDirectRelationship,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import { steps as activeDirectorySteps } from '../../../active-directory';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { relationships, entities, steps } from '../../constants';
import {
  createManagedDeviceEntity,
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
      ? createDirectRelationship({
          _class: relationships.MULTI_USER_HAS_DEVICE[0]._class,
          from: userEntity,
          to: deviceEntity,
        })
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
    entities: [...entities.MULTI_DEVICE],
    relationships: [...relationships.MULTI_USER_HAS_DEVICE],
    dependsOn: [activeDirectorySteps.FETCH_USERS],
    executionHandler: fetchDevices,
  },
];
