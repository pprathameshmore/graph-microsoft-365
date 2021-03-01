import { DeviceConfigurationDeviceStatus } from '@microsoft/microsoft-graph-types-beta';
import {
  createDeviceConfigurationNonComplianceFindingRelationship,
  createDeviceDeviceConfigurationRelationship,
  createNoncomplianceFindingEntity,
  findingIsOpen,
} from '../converters';
import exampleDeviceConfigurationEntity from './fixtures/exampleDeviceConfigurationEntity';
import exampleDeviceEntity from './fixtures/exampleDeviceEntity';
import exampleDeviceStatus from './fixtures/exampleDeviceStatus';
import exampleNoncomplianceFindingEntity from './fixtures/exampleNoncomplianceFindingEntity';

describe('createDeviceConfigurationEntity', () => {
  test('transfers properties correctly', () => {
    expect(
      createNoncomplianceFindingEntity(
        exampleDeviceStatus,
        exampleDeviceConfigurationEntity,
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

describe('findingIsOpen', () => {
  const closedFindings = [
    'notApplicable',
    'compliant',
    'remediated',
    'notAssigned',
    'unknown',
    undefined,
  ] as DeviceConfigurationDeviceStatus['status'][];

  closedFindings.forEach((closedFinding) => {
    test(`identifies ${closedFinding} as not open`, () => {
      expect(findingIsOpen(closedFinding)).toBe(false);
    });
  });

  const openFindings = [
    'nonCompliant',
    'error',
    'conflict',
  ] as DeviceConfigurationDeviceStatus['status'][];

  openFindings.forEach((openFinding) => {
    test(`identifies ${openFinding} as open`, () => {
      expect(findingIsOpen(openFinding)).toBe(true);
    });
  });
});
