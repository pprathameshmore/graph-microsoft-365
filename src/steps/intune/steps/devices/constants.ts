import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { entities as activeDirectoryEntities } from '../../../active-directory';

export const steps: { [k: string]: string } = {
  FETCH_DEVICES: 'managed-devices',
};

export const entities: { [k: string]: StepEntityMetadata } = {
  DEVICE: {
    resourceName: 'Managed Device',
    _type: 'intune_managed_device',
    _class: ['Host', 'Device'],
  },
};

export const relationships: { [k: string]: StepRelationshipMetadata } = {
  USER_HAS_DEVICE: {
    _type: 'microsoft_365_user_has_intune_managed_device',
    sourceType: activeDirectoryEntities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: entities.DEVICE._type,
  },
};
