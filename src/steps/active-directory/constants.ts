// Step IDs
export const STEP_ACCOUNT = 'account';
export const STEP_GROUPS = 'groups';
export const STEP_GROUP_MEMBERS = 'group-members';
export const STEP_USERS = 'users';

// Graph objects
export const ACCOUNT_ENTITY_TYPE = 'microsoft_365_account';
export const ACCOUNT_ENTITY_CLASS = 'Account';

export const GROUP_ENTITY_TYPE = 'microsoft_365_user_group';
export const GROUP_ENTITY_CLASS = 'UserGroup';

export const USER_ENTITY_TYPE = 'microsoft_365_user';
export const USER_ENTITY_CLASS = 'User';

/**
 * The entity type used for members of groups which are not one of the ingested
 * directory objects.
 */
export const GROUP_MEMBER_ENTITY_TYPE = 'microsoft_365_group_member';

/**
 * The entity class used for members of groups which are not one of the ingested
 * directory objects.
 */
export const GROUP_MEMBER_ENTITY_CLASS = 'User';

export const ACCOUNT_GROUP_RELATIONSHIP_TYPE =
  'microsoft_365_account_has_group';
export const ACCOUNT_USER_RELATIONSHIP_TYPE = 'microsoft_365_account_has_user';
export const GROUP_MEMBER_RELATIONSHIP_TYPE = 'microsoft_365_group_has_member';
