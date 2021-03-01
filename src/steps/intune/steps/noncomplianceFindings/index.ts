import {
  Step,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { entities, relationships, steps } from '../../constants';
import { createNoncomplianceFindingEntity } from './converters';
import { last } from 'lodash';
import { findingIsOpen } from './utils';

export async function fetchNonComplianceFindings(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );
  await jobState.iterateEntities(
    { _type: entities.DEVICE_CONFIGURATION._type },
    async (deviceConfigurationEntity: Entity) => {
      await intuneClient.iterateDeviceConfigurationDeviceStatuses(
        deviceConfigurationEntity.id as string,
        async (deviceStatus) => {
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

            const deviceId = last(deviceStatus.id?.split('_')); // I have no idea why Microsoft hid the device id this way, but they did :|
            const deviceEntity = (await jobState.findEntity(deviceId)) as
              | Entity
              | undefined;

            if (deviceEntity) {
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: relationships.DEVICE_USES_DEVICE_CONFIGURATION._class,
                  from: deviceEntity,
                  to: deviceConfigurationEntity,
                }),
              );
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING._class,
                  from: deviceEntity,
                  to: noncomplianceFindingEntity,
                }),
              );
            } else {
              logger.error(
                { deviceStatus, deviceConfigurationEntity },
                'Error creating Device -> DeviceConfiguration relationship: deviceEntity does note exist',
              );
            }
          }
        },
      );
    },
  );
}

export const noncomplianceFindingSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_NONCOMPLIANCE_FINDINGS,
    name: 'Noncompliance Findings',
    entities: [entities.NONCOMPLIANCE_FINDING],
    relationships: [
      relationships.DEVICE_USES_DEVICE_CONFIGURATION,
      relationships.DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING,
      relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING,
    ],
    dependsOn: [steps.FETCH_DEVICES, steps.FETCH_DEVICE_CONFIGURATIONS],
    executionHandler: fetchNonComplianceFindings,
  },
];
