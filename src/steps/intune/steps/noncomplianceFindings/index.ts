import {
  Step,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { entities, relationships, steps } from '../../constants';
import { DeviceConfigurationEntity } from '../../types';
import {
  findingIsOpen,
  createNoncomplianceFindingEntity,
  createDeviceConfigurationNonComplianceFindingRelationship,
  createDeviceDeviceConfigurationRelationship,
  createNoncomplianceFindingRelationship,
} from './converters';
import { last } from 'lodash';

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
    async (deviceConfigurationEntity: DeviceConfigurationEntity) => {
      await intuneClient.iterateDeviceConfigurationDeviceStatuses(
        deviceConfigurationEntity.id as string,
        async (deviceStatus) => {
          if (findingIsOpen(deviceStatus.status)) {
            const noncomplianceFindingEntity = createNoncomplianceFindingEntity(
              deviceStatus,
              deviceConfigurationEntity,
            );
            await jobState.addEntity(noncomplianceFindingEntity);
            await jobState.addRelationship(
              createDeviceConfigurationNonComplianceFindingRelationship(
                deviceConfigurationEntity,
                noncomplianceFindingEntity,
              ),
            );

            const deviceId = last(deviceStatus.id?.split('_')); // I have no idea why Microsoft hid the device id this way, but they did :|
            const deviceEntity = await jobState.findEntity(deviceId);
            if (deviceEntity) {
              await jobState.addRelationship(
                createDeviceDeviceConfigurationRelationship(
                  deviceConfigurationEntity,
                  deviceEntity,
                ),
              );
              await jobState.addRelationship(
                createNoncomplianceFindingRelationship(
                  noncomplianceFindingEntity,
                  deviceEntity,
                ),
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
