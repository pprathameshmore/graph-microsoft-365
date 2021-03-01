import { IosCustomConfiguration } from '@microsoft/microsoft-graph-types-beta';

// IosCustomConfiguration extends DeviceConfiguration
// https://docs.microsoft.com/en-us/graph/api/resources/intune-deviceconfig-ioscustomconfiguration?view=graph-rest-beta
export const exampleIosCustomConfiguration: IosCustomConfiguration & {
  '@odata.type': string;
} = {
  '@odata.type': '#microsoft.graph.iosCustomConfiguration',
  id: '6aa605f0-744e-4ae1-8031-c6564624c89b',
  lastModifiedDateTime: '2021-02-17T18:31:21.3225031Z',
  roleScopeTagIds: ['0'],
  supportsScopeTags: true,
  deviceManagementApplicabilityRuleOsEdition: null,
  deviceManagementApplicabilityRuleOsVersion: null,
  deviceManagementApplicabilityRuleDeviceMode: null,
  createdDateTime: '2021-02-17T18:31:21.3225031Z',
  description: null,
  displayName: 'Test configuration policy',
  version: 1,
  payloadName: 'Test fake profile',
  payloadFileName: 'lastSuccessfulBuildId.txt',
  payload: ('MTk3' as unknown) as number, // Looks like Microsoft's types are incorrect.
};
