import {
  Step,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  JobState,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import {
  entities,
  managedDeviceTypes,
  relationships,
  steps,
} from '../../constants';
import {
  createDetectedApplicationEntity,
  createManagedApplicationEntity,
  DETECTED_APP_KEY_PREFIX,
  findNewestVersion,
  MANAGED_APP_KEY_PREFIX,
} from './converters';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { DetectedApp } from '@microsoft/microsoft-graph-types-beta';

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
            'Error creating Device -> DeviceConfiguration relationship: deviceEntity does not exist',
          );
          return;
        }

        await jobState.addRelationship(
          createDirectRelationship({
            _class:
              relationships.MULTI_DEVICE_ASSIGNED_MANAGED_APPLICATION[0]._class,
            from: deviceEntity,
            to: managedAppEntity,
            properties: {
              installState: deviceStatus.installState, // Possible values are: installed, failed, notInstalled, uninstallFailed, pendingInstall, & unknown
              installStateDetail: deviceStatus.installStateDetail, // extra details on the install state. Ex: iosAppStoreUpdateFailedToInstall
              errorCode: deviceStatus.errorCode,
              installedVersion:
                managedApp.version ??
                findNewestVersion(managedApp) ??
                'unversioned',
            },
          }),
        );
      },
    );
  });
}

export async function fetchDetectedApplications(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );
  // Promise.all is likely ok in this case due to there only being a few device types
  await Promise.all(
    managedDeviceTypes.map(async (type) => {
      return await jobState.iterateEntities(
        { _type: type },
        async (deviceEntity) => {
          await intuneClient.iterateDetectedApps(
            deviceEntity.id as string,
            async ({ detectedApps }) => {
              for (const detectedApp of detectedApps ?? []) {
                // Ingest all assigned or line of business apps reguardless if a device has installed it or not yet
                const detectedAppEntity = await findOrCreateDetectedApplicationEntity(
                  detectedApp,
                  jobState,
                );
                try {
                  const version = detectedApp.version ?? 'unversioned';
                  const directRelationship = createDirectRelationship({
                    _class:
                      relationships
                        .MULTI_DEVICE_INSTALLED_DETECTED_APPLICATION[0]._class,
                    from: deviceEntity,
                    to: detectedAppEntity,
                    properties: {
                      version,
                    },
                  });
                  // Need to append the version to the end of the key so there can be multiple relationships to the same Application entityds
                  directRelationship._key += `|${version}`;
                  await jobState.addRelationship(directRelationship);
                } catch (err) {
                  // This happens when there are two instances of the same version of an app installed on a single device (it surprisingly does happen)
                  if (err.code !== 'DUPLICATE_KEY_DETECTED') {
                    throw err;
                  }
                }
                // If there is a managed application related to this, create a MANAGES relationship
                const managedAppEntity = await jobState.findEntity(
                  MANAGED_APP_KEY_PREFIX +
                    detectedApp.displayName?.toLowerCase(),
                );

                if (managedAppEntity) {
                  await jobState.addRelationship(
                    createDirectRelationship({
                      _class:
                        relationships
                          .MANAGED_APPLICATION_MANAGES_DETECTED_APPLICATION
                          ._class,
                      from: managedAppEntity,
                      to: detectedAppEntity,
                    }),
                  );
                }
              }
            },
          );
        },
      );
    }),
  );
}

async function findOrCreateDetectedApplicationEntity(
  detectedApp: DetectedApp,
  jobState: JobState,
): Promise<Entity> {
  let detectedAppEntity =
    detectedApp.id &&
    (await jobState.findEntity(
      DETECTED_APP_KEY_PREFIX + detectedApp.displayName?.toLowerCase(),
    ));

  if (!detectedAppEntity) {
    detectedAppEntity = createDetectedApplicationEntity(detectedApp);
    await jobState.addEntity(detectedAppEntity);
  }
  return detectedAppEntity;
}

export const applicationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_MANAGED_APPLICATIONS,
    name: 'Managed Applications',
    entities: [entities.MANAGED_APPLICATION],
    relationships: [...relationships.MULTI_DEVICE_ASSIGNED_MANAGED_APPLICATION],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: fetchManagedApplications,
  },
  {
    id: steps.FETCH_DETECTED_APPLICATIONS,
    name: 'Detected Applications',
    entities: [entities.DETECTED_APPLICATION],
    relationships: [
      ...relationships.MULTI_DEVICE_INSTALLED_DETECTED_APPLICATION,
      relationships.MANAGED_APPLICATION_MANAGES_DETECTED_APPLICATION,
    ],
    dependsOn: [steps.FETCH_DEVICES, steps.FETCH_MANAGED_APPLICATIONS],
    executionHandler: fetchDetectedApplications,
  },
];
