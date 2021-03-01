import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  IntegrationLogger,
  parseTimePropertyValue,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { DeviceConfigurationDeviceStatus } from '@microsoft/microsoft-graph-types-beta';
import { entities, relationships } from '../../constants';
import {
  calculateSeverity,
  calculateNumericSeverity,
  findingIsOpen,
} from './utils';

// https://docs.microsoft.com/en-us/graph/api/resources/intune-deviceconfig-deviceconfigurationdevicestatus?view=graph-rest-beta
export function createNoncomplianceFindingEntity(
  deviceStatus: DeviceConfigurationDeviceStatus,
  deviceConfigurationEntity: Entity,
  logger: IntegrationLogger,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: deviceStatus,
      assign: {
        _class: entities.NONCOMPLIANCE_FINDING._class,
        _type: entities.NONCOMPLIANCE_FINDING._type,
        id: deviceStatus.id,
        name: 'Latest finding from ' + deviceConfigurationEntity.displayName,
        category: 'endpoint',
        assessment: deviceConfigurationEntity.displayName,
        status: deviceStatus.status, // Possible values are: unknown, notApplicable, compliant, remediated, nonCompliant, error, conflict, notAssigned.
        severity: calculateSeverity(deviceStatus.status, logger),
        numericSeverity: calculateNumericSeverity(deviceStatus.status, logger),
        open: findingIsOpen(deviceStatus.status, logger),
        lastProcessedOn: parseTimePropertyValue(
          deviceStatus.lastReportedDateTime,
        ),
        lastTestedOn: parseTimePropertyValue(deviceStatus.lastReportedDateTime),
        lastUpdatedOn: parseTimePropertyValue(
          deviceStatus.lastReportedDateTime,
        ),
      },
    },
  });
}
