// import { RelationshipDirection } from '@jupiterone/integration-sdk-core';

import {
  createManagedDeviceEntity,
  createUserDeviceDirectRelationship,
  createUserDeviceMappedRelationship,
} from '../converters';
import exampleManagedDevice from './fixtures/exampleManagedDevice';
import exampleManagedDeviceEntity from './fixtures/exampleManagedDeviceEntity';

describe('createManagedDeviceEntity', () => {
  test('properties transferred', () => {
    expect(createManagedDeviceEntity(exampleManagedDevice)).toMatchSnapshot(
      'createManagedDeviceEntity',
    );
  });
});

describe('createUserDeviceMappedRelationship', () => {
  test('returns undefined without userId or email', () => {
    expect(
      createUserDeviceMappedRelationship(exampleManagedDeviceEntity),
    ).toBeUndefined();
  });
  test('properties transferred with userId', () => {
    expect(
      createUserDeviceMappedRelationship(exampleManagedDeviceEntity, 'userId'),
    ).toMatchSnapshot('createUserDeviceMappedRelationship');
  });
  test('properties transferred with email', () => {
    expect(
      createUserDeviceMappedRelationship(
        exampleManagedDeviceEntity,
        undefined,
        'email',
      ),
    ).toMatchSnapshot('createUserDeviceMappedRelationship');
  });
  test('properties transferred with both userId and email', () => {
    expect(
      createUserDeviceMappedRelationship(
        exampleManagedDeviceEntity,
        'userId',
        'email',
      ),
    ).toMatchSnapshot('createUserDeviceMappedRelationship');
  });
});

describe('createUserDeviceDirectRelationship', () => {
  test('properties transferred', () => {
    expect(
      createUserDeviceDirectRelationship(exampleManagedDeviceEntity, {
        _class: 'USER',
        _key: '1234',
        _type: 'microsoft_365_user',
      }),
    ).toMatchSnapshot('createUserDeviceDirectRelationship');
  });
});
