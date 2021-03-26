import {
  Entity,
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { DirectoryGraphClient } from './clients/directoryClient';
import {
  DATA_ACCOUNT_ENTITY,
  entities,
  relationships,
  steps,
} from './constants';
import {
  createAccountEntityWithOrganization,
  createAccountGroupRelationship,
  createAccountUserRelationship,
  createGroupEntity,
  createGroupMemberRelationship,
  createUserEntity,
} from './converters';

export * from './constants';

export async function fetchAccount(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const organization = await graphClient.fetchOrganization();
  const intuneAccountID = (await graphClient.getIntuneAccountId())
    ?.intuneAccountId;
  const subscriptionState = (await graphClient.getIntuneSubscriptionState())
    ?.value;
  const mobileDeviceManagementAuthority = (
    await graphClient.getMobileDeviceManagementAuthority(
      organization.id as string,
    )
  )?.mobileDeviceManagementAuthority;

  const accountEntity = createAccountEntityWithOrganization(
    instance,
    organization,
    { intuneAccountID, subscriptionState, mobileDeviceManagementAuthority },
  );
  await jobState.addEntity(accountEntity);
  await jobState.setData(DATA_ACCOUNT_ENTITY, accountEntity);
}

export async function fetchUsers(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const accountEntity = await jobState.getData<Entity>(DATA_ACCOUNT_ENTITY);
  if (!accountEntity) {
    logger.warn('Error fetching users: accountEntity does not exist');
    return;
  }
  await graphClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);
    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
    );
  });
}

export async function fetchGroups(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const accountEntity = await jobState.getData<Entity>(DATA_ACCOUNT_ENTITY);
  if (!accountEntity) {
    logger.warn('Error fetching groups: accountEntity does not exist');
    return;
  }
  await graphClient.iterateGroups(async (group) => {
    const groupEntity = createGroupEntity(group);
    await jobState.addEntity(groupEntity);
    await jobState.addRelationship(
      createAccountGroupRelationship(accountEntity, groupEntity),
    );
  });
}

export async function fetchGroupMembers(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  await jobState.iterateEntities(
    { _type: entities.GROUP._type },
    async (groupEntity) => {
      await graphClient.iterateGroupMembers(
        { groupId: groupEntity.id as string },
        async (groupMember) => {
          await jobState.addRelationship(
            createGroupMemberRelationship(groupEntity, groupMember),
          );
        },
      );
    },
  );
}

export const activeDirectorySteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_ACCOUNT,
    name: 'Active Directory Info',
    entities: [entities.ACCOUNT],
    relationships: [],
    executionHandler: fetchAccount,
  },
  {
    id: steps.FETCH_USERS,
    name: 'Active Directory Users',
    entities: [entities.USER],
    relationships: [relationships.ACCOUNT_HAS_USER],
    dependsOn: [steps.FETCH_ACCOUNT],
    executionHandler: fetchUsers,
  },
  {
    id: steps.FETCH_GROUPS,
    name: 'Active Directory Groups',
    entities: [entities.GROUP],
    relationships: [relationships.ACCOUNT_HAS_GROUP],
    dependsOn: [steps.FETCH_ACCOUNT],
    executionHandler: fetchGroups,
  },
  {
    id: steps.FETCH_GROUP_MEMBERS,
    name: 'Active Directory Group Members',
    entities: [entities.GROUP_MEMEBER],
    relationships: [
      relationships.GROUP_HAS_USER,
      relationships.GROUP_HAS_GROUP,
      relationships.GROUP_HAS_MEMBER,
    ],
    dependsOn: [steps.FETCH_GROUPS],
    executionHandler: fetchGroupMembers,
  },
];
