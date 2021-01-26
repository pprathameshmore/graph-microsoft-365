import { IntegrationConfig } from '../src/types';

export const config: IntegrationConfig = {
  clientId: process.env.CLIENT_ID || 'clientId',
  clientSecret: process.env.CLIENT_SECRET || 'clientSecret',
  directoryId:
    process.env.DIRECTORY_ID || 'a76fc728-0cba-45f0-a9eb-d45207e14513',
};

/**
 * An integration config pointing at a directory that does not authorize the
 * multi-tenant app in any way.
 */
export const inaccessibleDirectoryConfig: IntegrationConfig = {
  ...config,

  /**
   * The "J1 Inaccessible" directory/tenant of adamjupiteronehotmailcom Azure
   * account.
   */
  directoryId: 'd68d7cbe-a848-4b5a-98d6-d7b3d6f3dfc0',
};

/**
 * An integration config pointing at a directory that does not authorize the
 * multi-tenant app in any way.
 */
export const insufficientPermissionsDirectoryConfig: IntegrationConfig = {
  ...config,

  /**
   * The "J1 Insufficient Permissions" directory/tenant of
   * adamjupiteronehotmailcom Azure account.
   */
  directoryId: '6fec25dd-44d2-4f61-a797-603edc73fb50',
};
