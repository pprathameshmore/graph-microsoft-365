import {
  Step,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  Entity,
  JobState,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { entities, relationships, steps } from '../../constants';
import {
  createNoncomplianceFindingEntity,
  createCompliancePolicyEntity,
} from './converters';
import { last } from 'lodash';
import { DeviceCompliancePolicy } from '@microsoft/microsoft-graph-types-beta';
import { deviceIsRelatedToConfig, findingIsOpen } from '../../utils';

export async function fetchCompliancePolicyAndFindings(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );
  await intuneClient.iterateCompliancePolicies(async (compliancePolicy) => {
    await intuneClient.iterateCompliancePolicyDeviceStatuses(
      compliancePolicy.id as string,
      async (deviceStatus) => {
        const deviceId = last(deviceStatus.id?.split('_')); // Microsoft hid the device id in this way
        const deviceEntity = await jobState.findEntity(deviceId);

        if (!deviceEntity) {
          logger.warn(
            { deviceId, deviceStatus },
            'Error creating Device -> ConfigurationPolicy relationship: deviceEntity does not exist',
          );
        } else if (deviceIsRelatedToConfig(deviceStatus.status)) {
          // Only once we know the policy is attached to a device do we add it to the jobstate
          const compliancePolicyEntity = await findOrCreateCompliancePolicyEntity(
            compliancePolicy,
            jobState,
          );

          await jobState.addRelationship(
            createDirectRelationship({
              _class: relationships.DEVICE_ASSIGNED_COMPLIANCE_POLICY._class,
              from: deviceEntity,
              to: compliancePolicyEntity,
            }),
          );

          // Only create findings if they are open
          if (findingIsOpen(deviceStatus.status, logger) !== false) {
            const noncomplianceFindingEntity = createNoncomplianceFindingEntity(
              deviceStatus,
              compliancePolicyEntity,
              logger,
            );
            await jobState.addEntity(noncomplianceFindingEntity);
            await jobState.addRelationship(
              createDirectRelationship({
                _class:
                  relationships
                    .COMPLIANCE_POLICY_IDENTIFIED_NONCOMPLIANCE_FINDING._class,
                from: compliancePolicyEntity,
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
  });
}

async function findOrCreateCompliancePolicyEntity(
  compliancePolicy: DeviceCompliancePolicy,
  jobState: JobState,
): Promise<Entity> {
  let compliancePolicyEntity =
    compliancePolicy.id && (await jobState.findEntity(compliancePolicy.id));

  if (!compliancePolicyEntity) {
    compliancePolicyEntity = createCompliancePolicyEntity(compliancePolicy);
    await jobState.addEntity(compliancePolicyEntity);
  }
  return compliancePolicyEntity;
}

export const compliancePolicyAndFindingsSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_COMPLIANCE_POLICIES_AND_FINDINGS,
    name: 'Compliance Policies and Related Findings',
    entities: [entities.COMPLIANCE_POLICY, entities.NONCOMPLIANCE_FINDING],
    relationships: [
      relationships.DEVICE_ASSIGNED_COMPLIANCE_POLICY,
      relationships.COMPLIANCE_POLICY_IDENTIFIED_NONCOMPLIANCE_FINDING,
      relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING,
    ],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: fetchCompliancePolicyAndFindings,
  },
];
