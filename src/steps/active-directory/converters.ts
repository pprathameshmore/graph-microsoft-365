import {
  createIntegrationEntity,
  createIntegrationRelationship,
  Entity,
  getTime,
  IntegrationInstance,
  Relationship,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { Group, Organization, User } from '@microsoft/microsoft-graph-types';

import { GroupMember, MemberType } from './client';
import {
  ACCOUNT_ENTITY_CLASS,
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_GROUP_RELATIONSHIP_TYPE,
  GROUP_ENTITY_CLASS,
  GROUP_ENTITY_TYPE,
  GROUP_MEMBER_ENTITY_CLASS,
  GROUP_MEMBER_ENTITY_TYPE,
  GROUP_MEMBER_RELATIONSHIP_TYPE,
  USER_ENTITY_CLASS,
  USER_ENTITY_TYPE,
} from './constants';

export function createAccountEntity(instance: IntegrationInstance): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _class: ACCOUNT_ENTITY_CLASS,
        _key: `${ACCOUNT_ENTITY_TYPE}-${instance.id}`,
        _type: ACCOUNT_ENTITY_TYPE,
        name: instance.name,
        displayName: instance.name,
      },
    },
  });
}

export function createAccountEntityWithOrganization(
  instance: IntegrationInstance,
  organization: Organization,
): Entity {
  let defaultDomain: string | undefined;
  const verifiedDomains = organization.verifiedDomains?.map((e) => {
    if (e.isDefault) {
      defaultDomain = e.name;
    }
    return e.name as string;
  });

  return createIntegrationEntity({
    entityData: {
      source: organization,
      assign: {
        _class: ACCOUNT_ENTITY_CLASS,
        _key: `${ACCOUNT_ENTITY_TYPE}-${instance.id}`,
        _type: ACCOUNT_ENTITY_TYPE,
        name: organization.displayName,
        displayName: instance.name,
        organizationName: organization.displayName,
        defaultDomain,
        verifiedDomains,
      },
    },
  });
}

export function createGroupEntity(data: Group): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: GROUP_ENTITY_CLASS,
        _type: GROUP_ENTITY_TYPE,
        displayName: data.displayName,
        id: data.id,
        deletedOn: getTime(data.deletedDateTime),
        classification: data.classification,
        createdOn: getTime(data.createdDateTime),
        description: data.description,
        email: data.mail,
        mail: data.mail,
        mailEnabled: data.mailEnabled,
        mailNickname: data.mailNickname,
        renewedOn: getTime(data.renewedDateTime),
        securityEnabled: data.securityEnabled,
      },
    },
  });
}

export function createUserEntity(data: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: USER_ENTITY_CLASS,
        _type: USER_ENTITY_TYPE,
        displayName: data.displayName,
        givenName: data.givenName,
        firstName: data.givenName,
        jobTitle: data.jobTitle,
        email: data.mail,
        mail: data.mail,
        mobilePhone: data.mobilePhone,
        officeLocation: data.officeLocation,
        preferredLanguage: data.preferredLanguage,
        surname: data.surname,
        lastName: data.surname,
        userPrincipalName: data.userPrincipalName,
        id: data.id,
      },
    },
  });
}

export function createAccountGroupRelationship(
  account: Entity,
  group: Entity,
): Relationship {
  return createIntegrationRelationship({
    _class: 'HAS',
    fromKey: account._key,
    fromType: ACCOUNT_ENTITY_TYPE,
    toKey: group.id as string,
    toType: GROUP_ENTITY_TYPE,
    properties: {
      _type: ACCOUNT_GROUP_RELATIONSHIP_TYPE,
    },
  });
}

export function createAccountUserRelationship(
  account: Entity,
  user: Entity,
): Relationship {
  return createIntegrationRelationship({
    _class: 'HAS',
    from: account,
    to: user,
  });
}

export function createGroupMemberRelationship(
  group: Entity,
  member: GroupMember,
): Relationship {
  const memberEntityType = getGroupMemberEntityType(member);
  const memberEntityClass = getGroupMemberEntityClass(member);

  return createIntegrationRelationship({
    _class: 'HAS',
    _type: GROUP_MEMBER_RELATIONSHIP_TYPE,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: group._key,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _key: member.id,
        _type: memberEntityType,
        _class: memberEntityClass,
        displayName: member.displayName,
        jobTitle: member.jobTitle,
        email: member.mail,
      },
    },
    properties: {
      groupId: group.id,
      memberId: member.id,
      memberType: member['@odata.type'],
    },
  });
}

function getGroupMemberEntityType(member: GroupMember): string {
  switch (member['@odata.type']) {
    case MemberType.USER:
      return USER_ENTITY_TYPE;
    case MemberType.GROUP:
      return GROUP_ENTITY_TYPE;
    default:
      return GROUP_MEMBER_ENTITY_TYPE;
  }
}

function getGroupMemberEntityClass(member: GroupMember): string {
  switch (member['@odata.type']) {
    case MemberType.USER:
      return USER_ENTITY_CLASS;
    case MemberType.GROUP:
      return GROUP_ENTITY_CLASS;
    default:
      return GROUP_MEMBER_ENTITY_CLASS;
  }
}
