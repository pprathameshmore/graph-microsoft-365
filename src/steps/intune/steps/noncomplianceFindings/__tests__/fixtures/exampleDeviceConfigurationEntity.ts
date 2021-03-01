import { DeviceConfigurationEntity } from '../../../../types';

const exampleDeviceConfigurationEntity: DeviceConfigurationEntity = ({
  _class: ['Configuration'],
  _key: '5b748b7c-8b6a-41fd-bd97-f509fdf5caf5',
  _rawData: [
    {
      name: 'default',
      rawData: {
        '@odata.type': '#microsoft.graph.iosWiFiConfiguration',
        connectAutomatically: false,
        connectWhenNetworkNameIsHidden: false,
        createdDateTime: '2021-02-25T21:47:36.8239034Z',
        description: 'Test iOS wifi policy',
        deviceManagementApplicabilityRuleDeviceMode: null,
        deviceManagementApplicabilityRuleOsEdition: null,
        deviceManagementApplicabilityRuleOsVersion: null,
        disableMacAddressRandomization: null,
        displayName: 'Test iOS Wifi policy',
        id: '5b748b7c-8b6a-41fd-bd97-f509fdf5caf5',
        lastModifiedDateTime: '2021-02-25T21:47:36.8239034Z',
        networkName: 'fake network',
        preSharedKey: null,
        proxyAutomaticConfigurationUrl: null,
        proxyManualAddress: null,
        proxyManualPort: null,
        proxySettings: 'none',
        roleScopeTagIds: ['0'],
        ssid: 'FakeyFakerson',
        supportsScopeTags: true,
        version: 1,
        wiFiSecurityType: 'open',
      },
    },
  ],
  _type: 'intune_device_configuration',
  configurationType: 'iosWiFiConfiguration',
  createdOn: 1614289656823,
  description: 'Test iOS wifi policy',
  displayName: 'Test iOS Wifi policy',
  id: '5b748b7c-8b6a-41fd-bd97-f509fdf5caf5',
  name: 'Test iOS Wifi policy',
  version: 1,
} as unknown) as DeviceConfigurationEntity;

export default exampleDeviceConfigurationEntity;
