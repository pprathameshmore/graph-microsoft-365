import { deviceConfigurationAndFindingsSteps } from './steps/deviceConfigurationsAndFindings';
import { applicationSteps } from './steps/applications';
import { deviceSteps } from './steps/devices';
import { compliancePolicyAndFindingsSteps } from './steps/compliancePoliciesAndFindings';

export const intuneSteps = [
  ...deviceSteps,
  ...compliancePolicyAndFindingsSteps,
  ...deviceConfigurationAndFindingsSteps,
  ...applicationSteps,
];
