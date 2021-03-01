import { createDeviceConfigurationEntity } from '../converters';
import { exampleIosWiFiConfiguration } from './fixtures/exampleIosWiFiConfiguration';
import { exampleIosCustomConfiguration } from './fixtures/exampleIosCustomConfiguration';
import { exampleWindows10GeneralConfiguration } from './fixtures/exampleWindows10GeneralConfiguration';

describe('createManagedDeviceEntity', () => {
  test('iosCustomConfiguration', () => {
    expect(
      createDeviceConfigurationEntity(exampleIosCustomConfiguration),
    ).toMatchSnapshot('iosCustomConfiguration');
  });
  test('iosWifiConfiguration', () => {
    expect(
      createDeviceConfigurationEntity(exampleIosWiFiConfiguration),
    ).toMatchSnapshot('iosWifiConfiguration');
  });
  test('windows10GeneralConfiguration', () => {
    expect(
      createDeviceConfigurationEntity(exampleWindows10GeneralConfiguration),
    ).toMatchSnapshot('windows10GeneralConfiguration');
  });
});
