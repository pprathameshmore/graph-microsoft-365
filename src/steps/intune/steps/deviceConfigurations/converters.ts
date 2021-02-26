import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { DeviceConfiguration } from '@microsoft/microsoft-graph-types-beta';
import { entities } from '../../constants';
import { last } from 'lodash';
import { DeviceConfigurationEntity } from '../../types';

/**
 * There are several different types of device configuration based on your OS and what you are configuring.
 * So many that it does not make sense to ingest each individually until that granularity is desired,
 * or necessary. Because of that, this method ingests all device configurations the same way, and if
 * more granularity is desired, individual configuration settings can be viewed in the raw data.
 *
 * https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-deviceconfiguration?view=graph-rest-beta
 */
export function createDeviceConfigurationEntity(
  deviceConfiguration: DeviceConfiguration,
): DeviceConfigurationEntity {
  return createIntegrationEntity({
    entityData: {
      source: deviceConfiguration,
      assign: {
        _class: entities.DEVICE_CONFIGURATION._class,
        _type: entities.DEVICE_CONFIGURATION._type,
        id: deviceConfiguration.id,
        name: deviceConfiguration.displayName,
        description:
          deviceConfiguration.description || deviceConfiguration.displayName,
        displayName: deviceConfiguration.displayName,
        version: deviceConfiguration.version,
        configurationType: last(deviceConfiguration['@odata.type']?.split('.')), // Possable values are many, but some examples are iosCustomConfiguration, windows10GeneralConfiguration, iosWiFiConfiguration
      },
    },
  });
}
