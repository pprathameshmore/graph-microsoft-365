import { deviceConfigurationAndFindingsSteps } from './steps/deviceConfigurationsAndFindings';
import { deviceSteps } from './steps/devices';

export const intuneSteps = [
  ...deviceSteps,
  ...deviceConfigurationAndFindingsSteps,
];
