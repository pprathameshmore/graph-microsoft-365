import {
  Step,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import { entities, relationships, steps } from '../../constants';
import { createManagedApplicationEntity } from './converters';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';

export async function fetchManagedApplications(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );
  await intuneClient.iterateManagedApps(async (managedApp) => {
    // Ingest all assigned or line of business apps reguardless if a device has installed it or not yet
    const managedAppEntity = createManagedApplicationEntity(managedApp);
    await jobState.addEntity(managedAppEntity);

    await intuneClient.iterateManagedAppDeviceStatuses(
      managedApp.id as string,
      async (deviceStatus) => {
        const deviceId = deviceStatus.deviceId;
        const deviceEntity = await jobState.findEntity(deviceId as string);

        if (!deviceEntity) {
          logger.warn(
            { deviceId, deviceStatus },
            'Error creating Device -> DeviceConfiguration relationship: deviceEntity does note exist',
          );
          return;
        }

        await jobState.addRelationship(
          createDirectRelationship({
            _class: relationships.DEVICE_ASSIGNED_MANAGED_APPLICATION._class,
            from: deviceEntity,
            to: managedAppEntity,
            properties: {
              installState: deviceStatus.installState, // Possible values are: installed, failed, notInstalled, uninstallFailed, pendingInstall, & unknown
              installStateDetail: deviceStatus.installStateDetail, // extra details on the install state. Ex: iosAppStoreUpdateFailedToInstall
              errorCode: deviceStatus.errorCode,
            },
          }),
        );
      },
    );
  });
}

export const managedApplicationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_MANAGED_APPLICATIONS,
    name: 'Managed Applications',
    entities: [entities.MANAGED_APPLICATION],
    relationships: [relationships.DEVICE_ASSIGNED_MANAGED_APPLICATION],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: fetchManagedApplications,
  },
];
