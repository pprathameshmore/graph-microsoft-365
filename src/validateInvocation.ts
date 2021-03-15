import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './types';
import { GraphClient } from './ms-graph/client';

export function validateExecutionConfig(
  executionContext: IntegrationExecutionContext<IntegrationConfig>,
): void {
  const { clientId, clientSecret, tenant } = executionContext.instance.config;
  if (!clientId || !clientSecret || !tenant) {
    throw new IntegrationValidationError(
      'Config requires all of {clientId, clientSecret, tenant}',
    );
  }
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  validateExecutionConfig(context);
  const apiClient = new GraphClient(context.logger, context.instance.config);
  await apiClient.verifyAuthentication();
}
