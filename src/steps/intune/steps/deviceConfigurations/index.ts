import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { entities, steps } from '../../constants';
import { createDeviceConfigurationEntity } from './converters';

export async function fetchDeviceConfigurations(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );
  await intuneClient.iterateDeviceConfigurations(
    async (deviceConfiguration) => {
      const deviceConfigurationEntity = createDeviceConfigurationEntity(
        deviceConfiguration,
      );
      await jobState.addEntity(deviceConfigurationEntity);
    },
  );
}

export const deviceConfigurationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_DEVICE_CONFIGURATIONS,
    name: 'Device Configurations',
    entities: [entities.DEVICE_CONFIGURATION],
    relationships: [], // (Device => Device Configuration) relationship is created in the FETCH_NONCOMPLIANCE_FINDINGS step
    dependsOn: [],
    executionHandler: fetchDeviceConfigurations,
  },
];
