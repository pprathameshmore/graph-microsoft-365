import { ManagedDeviceEntity } from '../../../../types';

const exampleManagedDeviceEntity: ManagedDeviceEntity = ({
  id: '11111111-1111-1111-1111-111111111111',
  osVersion: '14.4',
  model: 'iPhone 11 Pro',
  _class: ['Host', 'Device'],
  _type: 'intune_managed_device',
  category: 'endpoint',
  name: 'Dude’s iPhone',
  deviceName: 'Dude’s iPhone',
  displayName: 'Dude’s iPhone',
  make: 'Apple',
  version: 'iPhone 11 Pro',
  serial: 'ZXCVZXCVZXCV',
  serialNumber: 'ZXCVZXCVZXCV',
  hardwareVendor: 'Apple',
  hardwareModel: 'iPhone 11 Pro',
  hardwareSerial: 'ZXCVZXCVZXCV',
  hardwareVersion: 'iPhone 11 Pro',
  meid: '0980980980980',
  imei: '1234123412341234',
  iccid: null,
  udid: null,
  wifiMacAddress: '91072387a74350',
  easDeviceId: false,
  assetTag: '11111111-1111-1111-1111-111111111111',
  osDetails: 'iOS version 14.4',
  osName: 'iOS',
  userEmails: ['dude@adamjupiteronehotmailcom.onmicrosoft.com'],
  BYOD: true,
  ownerType: 'personal',
  encrypted: true,
  managementAgent: 'mdm',
  state: 'managed',
  complianceState: 'noncompliant',
  userId: '99999999-9999-9999-9999-999999999999',
  userDisplayName: 'Dude',
  phoneNumber: '******5480',
  managed: true,
  supervised: false,
  jailBroken: false,
  username: 'dude@adamjupiteronehotmailcom.onmicrosoft.com',
  registrationState: 'registered',
  physical: true,
  _key: '11111111-1111-1111-1111-111111111111',
  _rawData: [
    {
      name: 'default',
      rawData: {
        id: '11111111-1111-1111-1111-111111111111',
        userId: '99999999-9999-9999-9999-999999999999',
        deviceName: 'Dude’s iPhone',
        ownerType: 'personal',
        managedDeviceOwnerType: 'personal',
        managementState: 'managed',
        enrolledDateTime: '2021-02-17T16:24:45Z',
        lastSyncDateTime: '2021-02-24T16:39:31Z',
        chassisType: 'unknown',
        operatingSystem: 'iOS',
        deviceType: 'iPhone',
        complianceState: 'noncompliant',
        jailBroken: 'False',
        managementAgent: 'mdm',
        osVersion: '14.4',
        easActivated: false,
        easDeviceId: 'QWERQWERQWERQWERQWER',
        easActivationDateTime: '0001-01-01T00:00:00Z',
        aadRegistered: null,
        azureADRegistered: null,
        deviceEnrollmentType: 'deviceEnrollmentManager',
        lostModeState: 'disabled',
        activationLockBypassCode: null,
        emailAddress: 'dude@adamjupiteronehotmailcom.onmicrosoft.com',
        azureActiveDirectoryDeviceId: '11111111-1111-1111-1111-111111111111',
        azureADDeviceId: '11111111-1111-1111-1111-111111111111',
        deviceRegistrationState: 'registered',
        deviceCategoryDisplayName: 'Unknown',
        isSupervised: false,
        exchangeLastSuccessfulSyncDateTime: '0001-01-01T00:00:00Z',
        exchangeAccessState: 'none',
        exchangeAccessStateReason: 'none',
        remoteAssistanceSessionUrl: null,
        remoteAssistanceSessionErrorDetails: null,
        isEncrypted: true,
        userPrincipalName: 'dude@adamjupiteronehotmailcom.onmicrosoft.com',
        model: 'iPhone 11 Pro',
        manufacturer: 'Apple',
        imei: '1234123412341234',
        complianceGracePeriodExpirationDateTime: '2021-02-17T19:13:41Z',
        serialNumber: 'ZXCVZXCVZXCV',
        phoneNumber: '******5480',
        androidSecurityPatchLevel: '',
        userDisplayName: 'Dude',
        configurationManagerClientEnabledFeatures: null,
        wiFiMacAddress: '91072387a74350',
        deviceHealthAttestationState: null,
        subscriberCarrier: 'Sprint',
        meid: '0980980980980',
        totalStorageSpaceInBytes: 68719476736,
        freeStorageSpaceInBytes: 14991491072,
        managedDeviceName: 'dude_IPhone_2/17/2021_4:24 PM',
        partnerReportedThreatState: 'unknown',
        retireAfterDateTime: '0001-01-01T00:00:00Z',
        preferMdmOverGroupPolicyAppliedDateTime: '0001-01-01T00:00:00Z',
        autopilotEnrolled: false,
        requireUserEnrollmentApproval: null,
        managementCertificateExpirationDate: '2022-02-15T19:56:28Z',
        iccid: null,
        udid: null,
        roleScopeTagIds: [],
        windowsActiveMalwareCount: 0,
        windowsRemediatedMalwareCount: 0,
        notes: null,
        configurationManagerClientHealthState: null,
        configurationManagerClientInformation: null,
        ethernetMacAddress: null,
        physicalMemoryInBytes: 0,
        processorArchitecture: 'unknown',
        specificationVersion: null,
        joinType: 'unknown',
        skuFamily: '',
        skuNumber: 0,
        managementFeatures: 'none',
        hardwareInformation: {
          serialNumber: 'ZXCVZXCVZXCV',
          totalStorageSpace: 0,
          freeStorageSpace: 0,
          imei: '1234123412341234',
          meid: null,
          manufacturer: null,
          model: null,
          phoneNumber: null,
          subscriberCarrier: null,
          cellularTechnology: null,
          wifiMac: null,
          operatingSystemLanguage: null,
          isSupervised: false,
          isEncrypted: false,
          batterySerialNumber: null,
          batteryHealthPercentage: 0,
          batteryChargeCycles: 0,
          isSharedDevice: false,
          tpmSpecificationVersion: null,
          operatingSystemEdition: null,
          deviceFullQualifiedDomainName: null,
          deviceGuardVirtualizationBasedSecurityHardwareRequirementState:
            'meetHardwareRequirements',
          deviceGuardVirtualizationBasedSecurityState: 'running',
          deviceGuardLocalSystemAuthorityCredentialGuardState: 'running',
          osBuildNumber: null,
          operatingSystemProductType: 0,
          ipAddressV4: null,
          subnetAddress: null,
          sharedDeviceCachedUsers: [],
        },
        deviceActionResults: [],
        usersLoggedOn: [
          {
            userId: '99999999-9999-9999-9999-999999999999',
            lastLogOnDateTime: '2021-02-24T16:39:31.171Z',
          },
        ],
      },
    },
  ],
} as unknown) as ManagedDeviceEntity;

export default exampleManagedDeviceEntity;
