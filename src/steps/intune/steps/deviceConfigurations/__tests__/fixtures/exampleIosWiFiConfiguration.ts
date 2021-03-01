import { IosWiFiConfiguration } from '@microsoft/microsoft-graph-types-beta';

// IosWiFiConfiguration extends DeviceConfiguration
// https://docs.microsoft.com/en-us/graph/api/resources/intune-deviceconfig-ioswificonfiguration?view=graph-rest-beta
const exampleIosWiFiConfiguration: IosWiFiConfiguration & {
  '@odata.type': string;
} = {
  '@odata.type': '#microsoft.graph.iosWiFiConfiguration',
  id: '5b748b7c-8b6a-41fd-bd97-f509fdf5caf5',
  lastModifiedDateTime: '2021-02-25T21:47:36.8239034Z',
  roleScopeTagIds: ['0'],
  supportsScopeTags: true,
  deviceManagementApplicabilityRuleOsEdition: null,
  deviceManagementApplicabilityRuleOsVersion: null,
  deviceManagementApplicabilityRuleDeviceMode: null,
  createdDateTime: '2021-02-25T21:47:36.8239034Z',
  description: 'Test iOS wifi policy',
  displayName: 'Test iOS Wifi policy',
  version: 1,
  networkName: 'fake network',
  ssid: 'FakeyFakerson',
  connectAutomatically: false,
  connectWhenNetworkNameIsHidden: false,
  wiFiSecurityType: 'open',
  proxySettings: 'none',
  proxyManualAddress: null,
  proxyManualPort: null,
  proxyAutomaticConfigurationUrl: null,
  disableMacAddressRandomization: null,
  preSharedKey: null,
};

export default exampleIosWiFiConfiguration;
