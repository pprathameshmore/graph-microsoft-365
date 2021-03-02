import { GraphClient } from '../../../ms-graph/client';
import {
  DeviceConfiguration,
  DeviceConfigurationDeviceOverview,
  DeviceConfigurationDeviceStatus,
  ManagedDevice,
} from '@microsoft/microsoft-graph-types-beta';

export class DeviceManagementIntuneClient extends GraphClient {
  //********** MANAGED DEVICES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-manageddevice?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-devices-manageddevice-list?view=graph-rest-1.0
  public async iterateManagedDevices(
    callback: (managedDevice: ManagedDevice) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl:
        'https://graph.microsoft.com/beta/deviceManagement/managedDevices',
      callback,
    });
  }

  //********** AZURE DEVICES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/device?view=graph-rest-1.0
  // Another way to get devices that contains some different information. Currently not using.

  //********** DEVICE CATEGORIES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicecategory?view=graph-rest-1.0
  // Groups of devices. Currently not using.

  //********** DEVICE CONFIGURATIONS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-deviceconfiguration?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-shared-deviceconfiguration-list?view=graph-rest-beta
  public async iterateDeviceConfigurations(
    callback: (
      deviceConfiguration: DeviceConfiguration & {
        deviceStatusOverview: DeviceConfigurationDeviceOverview;
      },
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceConfigurations`,
      callback,
    });
  }

  // NOTE: This turns into a relationship with MANAGED DEVICE
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-deviceconfigurationdevicestatus-list?view=graph-rest-beta
  public async iterateDeviceConfigurationDeviceStatuses(
    deviceConfigurationId: string,
    callback: (
      deviceConfigurationDeviceStatus: DeviceConfigurationDeviceStatus,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceConfigurations/${deviceConfigurationId}/deviceStatuses`,
      callback,
    });
  }

  //**********  DEVICE COMPLIANCE SCRIPTS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-devices-devicecompliancescript?view=graph-rest-beta
  // DeviceManagementManagedDevices.Read.All

  //********** DEVICE MANAGEMENT SCRIPTS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicemanagementscript?view=graph-rest-beta
  // Can be used to find computer-specific findings such as the Windows protection state. Currently not used
  // https://docs.microsoft.com/en-us/graph/api/intune-devices-windowsprotectionstate-get?view=graph-rest-beta

  //********** WINDOWS MALWARE STATE **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-devices-windowsmalwareinformation?view=graph-rest-beta
  // Can be used to get findings of malware on windows devices. Currently not used

  //********** DEVICE COMPLIANCE POLICIES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicecompliancepolicy?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  //********** DEVICE MANAGEMENT INTENTS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-deviceintent-devicemanagementintent?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  //********** OFFICE SETTINGS **********/
  // https://config.office.com/api/OfficeSettings/policies
  // Intune has special policies specifically for Office 365 that you need to query for in a different way. Not currently using.
}
