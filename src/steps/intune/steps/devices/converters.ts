import {
  createDirectRelationship,
  createIntegrationEntity,
  createMappedRelationship,
  Entity,
  Relationship,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { ManagedDevice } from '@microsoft/microsoft-graph-types-beta';
import { entities as activeDirectoryEntities } from '../../../active-directory';
import { entities, relationships } from './constants';

type ManagedDeviceEntity = any;

// https://docs.microsoft.com/en-us/graph/api/resources/intune-devices-manageddevice?view=graph-rest-1.0&viewFallbackFrom=graph-rest-beta
export function createManagedDeviceEntity(managedDevice: ManagedDevice) {
  return createIntegrationEntity({
    entityData: {
      source: managedDevice,
      assign: {
        _class: entities.DEVICE._class,
        _type: entities.DEVICE._type,
        category: 'endpoint',
        id: managedDevice.id,
        name: managedDevice.deviceName,
        deviceName: managedDevice.deviceName,
        displayName: managedDevice.deviceName as string,
        model: managedDevice.model,
        make: managedDevice.manufacturer,
        version: managedDevice.model,
        serial: managedDevice.serialNumber,
        serialNumber: managedDevice.serialNumber,
        hardwareVendor:
          managedDevice.hardwareInformation?.manufacturer ??
          managedDevice.manufacturer,
        hardwareModel:
          managedDevice.hardwareInformation?.model ?? managedDevice.model,
        hardwareSerial:
          managedDevice.hardwareInformation?.serialNumber ??
          managedDevice.serialNumber,
        hardwareVersion:
          managedDevice.hardwareInformation?.model ?? managedDevice.model,
        meid: managedDevice.meid, // A mobile equipment identifier (MEID) is a globally unique number identifying a physical piece of CDMA2000 mobile station equipment
        imei: managedDevice.imei, // The International Mobile Equipment Identity (IMEI) is a number, usually unique, to identify 3GPP and iDEN mobile phones, as well as some satellite phones.
        iccid: managedDevice.iccid, // Every SIM card has a ICCID number, which stands for Integrated Circuit Card Identifier
        udid: managedDevice.udid, // UDID is an acronym for Unique Device Identifier.
        wifiMacAddress: managedDevice.wiFiMacAddress, // To communicate with a Wi-Fi network, a device must identify itself to the network using a unique network address called a Media Access Control (MAC) address
        easDeviceId: managedDevice.easActivated && managedDevice.easDeviceId, // Microsoft Exchange ActiveSync device identifier
        assetTag:
          managedDevice.azureActiveDirectoryDeviceId ??
          managedDevice.azureADDeviceId, // I believe these are legacy values now
        osDetails: `${managedDevice.operatingSystem} version ${managedDevice.osVersion}`,
        osName: managedDevice.operatingSystem,
        osVersion: managedDevice.osVersion,
        userEmails: managedDevice.emailAddress
          ? [managedDevice.emailAddress]
          : [],
        BYOD: managedDevice.managedDeviceOwnerType === 'personal',
        ownerType: managedDevice.managedDeviceOwnerType, // 'personal', 'company' or 'unknown'
        encrypted: managedDevice.isEncrypted,
        managementAgent: managedDevice.managementAgent, //Management channel of the device. Intune, EAS, etc. Possible values are: eas, mdm, easMdm, intuneClient, easIntuneClient, configurationManagerClient, configurationManagerClientMdm, configurationManagerClientMdmEas, unknown, jamf, googleCloudDevicePolicyController
        state: managedDevice.managementState,
        complianceState: managedDevice.complianceState,
        userId: managedDevice.userId,
        userDisplayName: managedDevice.userDisplayName,
        phoneNumber: managedDevice.phoneNumber,
        managed:
          managedDevice.managementState &&
          managedDevice.managementState !== 'discovered',
        supervised: managedDevice.isSupervised,
        jailBroken: managedDevice.jailBroken !== 'False',
        username: managedDevice.userPrincipalName, // Possible values are: notRegistered, registered, revoked, keyConflict, approvalPending, certificateReset, notRegisteredPendingEnrollment, unknown.
        registrationState: managedDevice.deviceRegistrationState,
        physical: managedDevice.model && managedDevice !== 'Virtual Machine', // https://docs.microsoft.com/en-us/mem/intune/fundamentals/windows-10-virtual-machines#reporting
        // POTENTIAL: managedDevice.usersLoggedOn - link out to other users perhaps?
      },
    },
  });
}

/**
 * Creates a mapped relationship between a User and a Device if userId or email is provided.
 * Should be used when the active directory is not being ingested in this integration instance.
 */
export function createUserDeviceMappedRelationship(
  managedDeviceEntity: ManagedDeviceEntity,
  userId?: string,
  email?: string,
): Relationship | undefined {
  return userId || email
    ? createMappedRelationship({
        _class: relationships.USER_HAS_DEVICE._class,
        _type: relationships.USER_HAS_DEVICE._type,
        _mapping: {
          sourceEntityKey: managedDeviceEntity._key,
          relationshipDirection: RelationshipDirection.REVERSE,
          targetFilterKeys: [
            ['_class', 'id'],
            ['_class', 'email'],
          ],
          targetEntity: {
            _class: activeDirectoryEntities.USER._class,
            _type: activeDirectoryEntities.USER._type,
            _key: userId,
            id: userId,
            email: email,
          },
        },
      })
    : undefined;
}

export function createUserDeviceDirectRelationship(
  managedDeviceEntity: ManagedDeviceEntity,
  userEntity: Entity,
): Relationship {
  return createDirectRelationship({
    _class: relationships.USER_HAS_DEVICE._class,
    from: userEntity,
    to: managedDeviceEntity,
  });
}
