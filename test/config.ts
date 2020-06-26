import { IntegrationConfig } from '../src/types';

const config: IntegrationConfig = {
  clientId: process.env.CLIENT_ID || 'clientId',
  clientSecret: process.env.CLIENT_SECRET || 'clientSecret',
  directoryId:
    process.env.DIRECTORY_ID || 'a76fc728-0cba-45f0-a9eb-d45207e14513',
};

export default config;
