import { Organization } from '@microsoft/microsoft-graph-types';

const exampleOrganization: Organization = {
  id: '1111111-1111-1111-1111-111111111111',
  deletedDateTime: undefined,
  businessPhones: [],
  city: undefined,
  country: undefined,
  countryLetterCode: 'US',
  createdDateTime: '2019-09-04T16:59:36Z',
  displayName: 'Default Directory',
  marketingNotificationEmails: [],
  onPremisesLastSyncDateTime: undefined,
  onPremisesSyncEnabled: undefined,
  postalCode: undefined,
  preferredLanguage: 'en',
  privacyProfile: undefined,
  securityComplianceNotificationMails: [],
  securityComplianceNotificationPhones: [],
  state: undefined,
  street: undefined,
  technicalNotificationMails: [
    'technicalNotificationMail.jupiterone@hotmail.com',
  ],
  assignedPlans: [
    {
      assignedDateTime: '2021-01-13T21:06:18Z',
      capabilityStatus: 'Deleted',
      service: 'SCO',
      servicePlanId: '1111111-1111-1111-1111-111111111111',
    },
    {
      assignedDateTime: '2021-01-13T21:06:12Z',
      capabilityStatus: 'Enabled',
      service: 'MicrosoftKaizala',
      servicePlanId: '1111111-1111-1111-1111-111111111111',
    },
  ],
  provisionedPlans: [
    {
      capabilityStatus: 'Enabled',
      provisioningStatus: 'Success',
      service: 'MicrosoftCommunicationsOnline',
    },
    {
      capabilityStatus: 'Enabled',
      provisioningStatus: 'Success',
      service: 'SharePoint',
    },
  ],
  verifiedDomains: [
    {
      capabilities: 'Email, OfficeCommunicationsOnline',
      isDefault: true,
      isInitial: true,
      name: 'verifiedDomain.onmicrosoft.com',
      type: 'Managed',
    },
  ],
};

export default exampleOrganization;
