import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import {
  createDeviceConfigurationNonComplianceFindingRelationship,
  createDeviceDeviceConfigurationRelationship,
  createNoncomplianceFindingEntity,
} from '../converters';
import { exampleDeviceConfigurationEntity } from './fixtures/exampleDeviceConfigurationEntity';
import { exampleDeviceEntity } from './fixtures/exampleDeviceEntity';
import { exampleDeviceStatus } from './fixtures/exampleDeviceStatus';
import { exampleNoncomplianceFindingEntity } from './fixtures/exampleNoncomplianceFindingEntity';

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

describe('createDeviceDeviceConfigurationRelationship', () => {
  test('transfers properties correctly', () => {
    expect(
      createDeviceDeviceConfigurationRelationship(
        exampleDeviceConfigurationEntity,
        exampleDeviceEntity,
      ),
    ).toMatchSnapshot('createDeviceDeviceConfigurationRelationship');
  });
});

describe('createDeviceConfigurationNonComplianceFindingRelationship', () => {
  test('transfers properties correctly', () => {
    expect(
      createDeviceConfigurationNonComplianceFindingRelationship(
        exampleDeviceConfigurationEntity,
        exampleNoncomplianceFindingEntity,
      ),
    ).toMatchSnapshot(
      'createDeviceConfigurationNonComplianceFindingRelationship',
    );
  });
});
