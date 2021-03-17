import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationSteps } from '../..';
import { config, noMdmConfig } from '../../../test/config';
import { setupAzureRecording } from '../../../test/recording';
import { getStepStartStates } from '../getStepStartStates';
import { set } from 'lodash';
import { intuneSteps } from '../../steps/intune';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('getStepStartStates', () => {
  it('should enable Intune steps properly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'getStepStartStatesWithIntune',
    });

    const context = createMockStepExecutionContext({ instanceConfig: config });
    expect(await getStepStartStates(context)).toEqual(
      integrationSteps.reduce(
        (acc, step) => set(acc, `${step.id}.disabled`, false),
        {},
      ),
    );
  });
  it('should disable Intune steps properly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'getStepStartStatesWithoutIntune',
      options: {
        recordFailedRequests: true, // IntuneAccountId call should fail
      },
    });

    const context = createMockStepExecutionContext({
      instanceConfig: noMdmConfig,
    });
    expect(await getStepStartStates(context)).toEqual(
      integrationSteps.reduce(
        (acc, step) =>
          set(
            acc,
            `${step.id}.disabled`,
            intuneSteps.map((s) => s.id).includes(step.id),
          ),
        {},
      ),
    );
  });
});
