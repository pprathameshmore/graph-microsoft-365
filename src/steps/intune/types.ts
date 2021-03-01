import { Entity } from '@jupiterone/integration-sdk-core';
type Opaque<K, T> = T & { __TYPE__: K };

export type ManagedDeviceEntity = Opaque<'ManagedDeviceEntity', Entity>;
export type DeviceConfigurationEntity = Opaque<
  'DeviceConfigurationEntity',
  Entity
>;
export type NoncomplianceFindingEntity = Opaque<
  'NoncomplianceFindingEntity',
  Entity
>;
