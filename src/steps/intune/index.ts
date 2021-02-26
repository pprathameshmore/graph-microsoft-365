import { deviceConfigurationSteps } from './steps/deviceConfigurations';
import { deviceSteps } from './steps/devices';
import { noncomplianceFindingSteps } from './steps/noncomplianceFindings';

export const intuneSteps = [
  ...deviceSteps,
  ...deviceConfigurationSteps,
  ...noncomplianceFindingSteps,
];
