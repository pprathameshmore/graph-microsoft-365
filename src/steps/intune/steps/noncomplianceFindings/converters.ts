import {
  createDirectRelationship,
  createIntegrationEntity,
  parseTimePropertyValue,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { DeviceConfigurationDeviceStatus } from '@microsoft/microsoft-graph-types-beta';
import { entities, relationships } from '../../constants';
import {
  DeviceConfigurationEntity,
  ManagedDeviceEntity,
  NoncomplianceFindingEntity,
} from '../../types';

// https://docs.microsoft.com/en-us/graph/api/resources/intune-deviceconfig-deviceconfigurationdevicestatus?view=graph-rest-beta
export function createNoncomplianceFindingEntity(
  deviceStatus: DeviceConfigurationDeviceStatus,
  deviceConfigurationEntity: DeviceConfigurationEntity,
): NoncomplianceFindingEntity {
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
        severity: calculateSeverity(deviceStatus.status),
        numericSeverity: calculateNumericSeverity(deviceStatus.status),
        open: findingIsOpen(deviceStatus.status),
        lastProcessedOn: parseTimePropertyValue(
          deviceStatus.lastReportedDateTime,
        ),
        lastTestedOn: parseTimePropertyValue(deviceStatus.lastReportedDateTime),
        lastUpdatedOn: parseTimePropertyValue(
          deviceStatus.lastReportedDateTime,
        ),
      },
    },
  }) as NoncomplianceFindingEntity;
}

export function findingIsOpen(
  deviceStatus: DeviceConfigurationDeviceStatus['status'],
) {
  return ![
    'notApplicable',
    'compliant',
    'remediated',
    'notAssigned',
    'unknown',
    undefined,
  ].includes(deviceStatus);
}

function calculateNumericSeverity(
  deviceStatus: DeviceConfigurationDeviceStatus['status'],
) {
  if (!findingIsOpen(deviceStatus)) {
    return 1;
  }
  switch (deviceStatus) {
    case 'nonCompliant':
    case 'error':
    case 'conflict':
      return 6;
    default:
      return 1; // This should not happen as we should not create findings without the above statuses
  }
}

function calculateSeverity(
  deviceStatus: DeviceConfigurationDeviceStatus['status'],
) {
  const numbericSeverity = calculateNumericSeverity(deviceStatus);
  if (1 <= numbericSeverity && numbericSeverity <= 2) {
    return 'informational';
  } else if (3 <= numbericSeverity && numbericSeverity <= 4) {
    return 'low';
  } else if (5 <= numbericSeverity && numbericSeverity <= 6) {
    return 'medium';
  } else if (7 <= numbericSeverity && numbericSeverity <= 8) {
    return 'high';
  } else if (9 <= numbericSeverity && numbericSeverity <= 10) {
    return 'critical';
  } else {
    return 'none';
  }
}

export function createDeviceDeviceConfigurationRelationship(
  deviceConfigurationEntity: DeviceConfigurationEntity,
  managedDeviceEntity: ManagedDeviceEntity,
): Relationship {
  return createDirectRelationship({
    _class: relationships.DEVICE_USES_DEVICE_CONFIGURATION._class,
    from: managedDeviceEntity,
    to: deviceConfigurationEntity,
  });
}

export function createNoncomplianceFindingRelationship(
  noncomplianceFindingEntity: NoncomplianceFindingEntity,
  managedDeviceEntity: ManagedDeviceEntity,
): Relationship {
  return createDirectRelationship({
    _class: relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING._class,
    from: managedDeviceEntity,
    to: noncomplianceFindingEntity,
  });
}

export function createDeviceConfigurationNonComplianceFindingRelationship(
  deviceConfigurationEityty: DeviceConfigurationEntity,
  noncomplianceFindingEntity: NoncomplianceFindingEntity,
): Relationship {
  return createDirectRelationship({
    _class:
      relationships.DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING
        ._class,
    from: deviceConfigurationEityty,
    to: noncomplianceFindingEntity,
  });
}
