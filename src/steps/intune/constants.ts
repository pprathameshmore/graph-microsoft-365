import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { entities as activeDirectoryEntities } from '../active-directory';

export const steps: { [k: string]: string } = {
  FETCH_DEVICES: 'managed-devices',
  FETCH_DEVICE_CONFIGURATIONS_AND_FINDINGS:
    'device-configurations-and-findings',
};

export const entities: { [k: string]: StepEntityMetadata } = {
  DEVICE: {
    resourceName: 'Managed Device',
    _type: 'intune_managed_device',
    _class: 'Device',
  },
  DEVICE_CONFIGURATION: {
    resourceName: 'Device Configuration',
    _type: 'intune_device_configuration',
    _class: 'Configuration',
  },
  NONCOMPLIANCE_FINDING: {
    resourceName: 'Noncompliance Finding',
    _type: 'intune_noncompliance_finding',
    _class: 'Finding',
  },
};

export const relationships: { [k: string]: StepRelationshipMetadata } = {
  USER_HAS_DEVICE: {
    _type: 'azure_user_has_intune_managed_device',
    sourceType: activeDirectoryEntities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: entities.DEVICE._type,
  },
  DEVICE_USES_DEVICE_CONFIGURATION: {
    _type: 'intune_managed_device_uses_device_configuration',
    sourceType: entities.DEVICE._type,
    _class: RelationshipClass.USES,
    targetType: entities.DEVICE_CONFIGURATION._type,
  },
  DEVICE_CONFIGURATION_IDENTIFIED_NONCOMPLIANCE_FINDING: {
    _type: 'intune_device_configuration_identified_noncompliance_finding',
    sourceType: entities.DEVICE_CONFIGURATION._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: entities.NONCOMPLIANCE_FINDING._type,
  },
  DEVICE_HAS_NONCOMPLIANCE_FINDING: {
    _type: 'intune_managed_device_has_noncompliance_finding',
    sourceType: entities.DEVICE._type,
    _class: RelationshipClass.HAS,
    targetType: entities.NONCOMPLIANCE_FINDING._type,
  },
};