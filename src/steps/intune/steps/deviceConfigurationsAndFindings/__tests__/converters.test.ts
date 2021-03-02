import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import { createNoncomplianceFindingEntity } from '../converters';
import { exampleDeviceConfigurationEntity } from './fixtures/exampleDeviceConfigurationEntity';
import { exampleDeviceStatus } from './fixtures/exampleDeviceStatus';

const logger = createMockIntegrationLogger();

describe('createDeviceConfigurationEntity', () => {
  test('transfers properties correctly', () => {
    expect(
      createNoncomplianceFindingEntity(
        exampleDeviceStatus,
        exampleDeviceConfigurationEntity,
        logger,
      ),
    ).toMatchSnapshot('createNoncomplianceFindingEntity');
  });
});
