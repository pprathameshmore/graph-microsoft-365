import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { entities, fetchAccount } from '..';
import {
  config,
  insufficientPermissionsDirectoryConfig,
} from '../../../../test/config';
import { setupAzureRecording } from '../../../../test/recording';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

// NOTE: Skipping due to an Azure AD being down at the time of writing this. Once that is fix, unskip these tests.
describe.skip('fetchAccount', () => {
  it('Should create an account entity correctly when the account has the correct permissions', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchAccount',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchAccount(context);

    const accountEntities = context.jobState.collectedEntities;

    expect(accountEntities.length).toBe(1);
    expect(accountEntities).toMatchGraphObjectSchema({
      _class: entities.ACCOUNT._class,
    });
    expect(accountEntities).toMatchSnapshot('accountEntitiesSuccessful');
  });
  it('Should create a dummy account entity when there are errors attempting to get organization data', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchAccountFail',
    });
    const context = createMockStepExecutionContext({
      instanceConfig: insufficientPermissionsDirectoryConfig,
    });

    await fetchAccount(context);

    const accountEntities = context.jobState.collectedEntities;

    expect(accountEntities.length).toBe(1);
    expect(accountEntities).toMatchGraphObjectSchema({
      _class: entities.ACCOUNT._class,
    });
    expect(accountEntities).toMatchSnapshot('accountEntitiesFail');
  });
});
