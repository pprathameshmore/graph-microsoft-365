import {
  Step,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { entities, relationships, steps } from '../../constants';
import {
  createNoncomplianceFindingEntity,
  createDeviceConfigurationEntity,
} from './converters';
import { last } from 'lodash';
import { deviceIsRelatedToConfig, findingIsOpen } from './utils';

export async function fetchDeviceConfigurationsAndFindings(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );
  await intuneClient.iterateDeviceConfigurations(
    async (deviceConfiguration) => {
      await intuneClient.iterateDeviceConfigurationDeviceStatuses(
        deviceConfiguration.id as string,
        async (deviceStatus) => {
          const deviceId = last(deviceStatus.id?.split('_')); // Microsoft hid the device id in this way
          const deviceEntity = await jobState.findEntity(deviceId);

          if (!deviceEntity) {
            {
              logger.warn(
                { deviceId, deviceStatus },
                'Error creating Device -> DeviceConfiguration relationship: deviceEntity does note exist',
              );
            }
          } else if (deviceIsRelatedToConfig(deviceStatus.status)) {
            // Only once we know the configuration is attached to a device do we add it to the jobstate
            let deviceConfigurationEntity = deviceConfiguration.id
              ? await jobState.findEntity(deviceConfiguration.id)
              : undefined;
            if (!deviceConfigurationEntity) {
              deviceConfigurationEntity = createDeviceConfigurationEntity(
                deviceConfiguration,
              );
              await jobState.addEntity(deviceConfigurationEntity);
            }

            await jobState.addRelationship(
              createDirectRelationship({
                _class: relationships.DEVICE_USES_DEVICE_CONFIGURATION._class,
                from: deviceEntity,
                to: deviceConfigurationEntity,
              }),
            );

            // Only create findings if they are open
            if (findingIsOpen(deviceStatus.status, logger) !== false) {
              const noncomplianceFindingEntity = createNoncomplianceFindingEntity(
                deviceStatus,
                deviceConfigurationEntity,
                logger,
              );
              await jobState.addEntity(noncomplianceFindingEntity);
              await jobState.addRelationship(
                createDirectRelationship({
                  _class:
                    relationships
                      .DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING
                      ._class,
                  from: deviceConfigurationEntity,
                  to: noncomplianceFindingEntity,
                }),
              );
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING._class,
                  from: deviceEntity,
                  to: noncomplianceFindingEntity,
                }),
              );
            }
          }
        },
      );
    },
  );
}

export const deviceConfigurationAndFindingsSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_DEVICE_CONFIGURATIONS_AND_FINDINGS,
    name: 'Device Configurations and Related Findings',
    entities: [entities.DEVICE_CONFIGURATION, entities.NONCOMPLIANCE_FINDING],
    relationships: [
      relationships.DEVICE_USES_DEVICE_CONFIGURATION,
      relationships.DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING,
      relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING,
    ],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: fetchDeviceConfigurationsAndFindings,
  },
];
