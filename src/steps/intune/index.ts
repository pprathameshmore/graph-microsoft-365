import { deviceConfigurationAndFindingsSteps } from './steps/deviceConfigurationsAndFindings';
import { managedApplicationSteps } from './steps/applications';
import { deviceSteps } from './steps/devices';

export const intuneSteps = [
  ...deviceSteps,
  ...deviceConfigurationAndFindingsSteps,
  ...managedApplicationSteps,
];
