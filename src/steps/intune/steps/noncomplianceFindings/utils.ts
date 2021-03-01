import { IntegrationLogger } from '@jupiterone/integration-sdk-core';
import { DeviceConfigurationDeviceStatus } from '@microsoft/microsoft-graph-types-beta';

/**
 * Device statuses that indicate that a finding should not be open
 */
export const CLOSED_DEVICE_STATUSES: DeviceConfigurationDeviceStatus['status'][] = [
  'notApplicable',
  'compliant',
  'remediated',
  'notAssigned',
  'unknown',
];

/**
 * Device statuses that indicate that a finding should not be open
 */
export const OPEN_DEVICE_STATUSES: DeviceConfigurationDeviceStatus['status'][] = [
  'nonCompliant',
  'error',
  'conflict',
];

/**
 * Determines if the finding is open based of the device status
 */
export function findingIsOpen(
  deviceStatus: DeviceConfigurationDeviceStatus['status'],
  logger: IntegrationLogger,
): true | false | undefined {
  if (CLOSED_DEVICE_STATUSES.includes(deviceStatus)) {
    return false;
  }
  if (OPEN_DEVICE_STATUSES.includes(deviceStatus)) {
    return true;
  }
  if (deviceStatus === undefined) {
    return undefined;
  }
  logger.warn({ deviceStatus }, 'Unexpected device status');
  return undefined;
}

export function calculateNumericSeverity(
  deviceStatus: DeviceConfigurationDeviceStatus['status'],
  logger: IntegrationLogger,
) {
  if (!findingIsOpen(deviceStatus, logger)) {
    return 1;
  }
  switch (deviceStatus) {
    case 'nonCompliant':
    case 'error':
    case 'conflict':
      return 6;
    default:
      logger.warn(
        { deviceStatus },
        'Unexpected device status when calculating numeric severity',
      );
      return 1;
  }
}

export function calculateSeverity(
  deviceStatus: DeviceConfigurationDeviceStatus['status'],
  logger: IntegrationLogger,
) {
  const numericSeverity = calculateNumericSeverity(deviceStatus, logger);
  if (numericSeverity <= 2) {
    return 'informational';
  } else if (numericSeverity <= 4) {
    return 'low';
  } else if (numericSeverity <= 6) {
    return 'medium';
  } else if (numericSeverity <= 8) {
    return 'high';
  } else if (numericSeverity <= 10) {
    return 'critical';
  } else {
    return 'none';
  }
}
