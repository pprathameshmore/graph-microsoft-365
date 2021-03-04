import { deviceConfigurationAndFindingsSteps } from './steps/deviceConfigurationsAndFindings';
import { applicationSteps } from './steps/applications';
import { deviceSteps } from './steps/devices';

export const intuneSteps = [
  ...deviceSteps,
  ...deviceConfigurationAndFindingsSteps,
  ...applicationSteps,
];
