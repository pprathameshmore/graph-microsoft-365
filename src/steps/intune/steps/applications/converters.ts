import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import {
  AndroidManagedStoreApp,
  ManagedApp,
  WebApp,
  IosLobApp,
  AndroidLobApp,
  WindowsPhoneXAP,
  MobileLobApp,
} from '@microsoft/microsoft-graph-types-beta';
import { entities } from '../../constants';
import { contains } from 'lodash';

// https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-mobileapp?view=graph-rest-beta
export function createManagedApplicationEntity(
  managedApp: ManagedApp & { '@odata.type': string },
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: managedApp,
      assign: {
        _class: entities.MANAGED_APPLICATION._class,
        _type: entities.MANAGED_APPLICATION._type,
        id: managedApp.id,
        name: managedApp.displayName,
        displayName: managedApp.displayName as string,
        description: managedApp.description,
        notes: managedApp.notes ? [managedApp.notes] : [],
        COTS: !isLineOfBusiness(managedApp['@odata.type']),
        external: !isLineOfBusiness(managedApp['@odata.type']),
        mobile: isMobile(managedApp['@odata.type']),
        productionURL:
          (managedApp as WebApp).appUrl ??
          (managedApp as AndroidManagedStoreApp).appStoreUrl,
        publisher: managedApp.publisher,
        isPublished: managedApp.publishingState === 'published', // Essentially if it is available for download
        createdOn:
          managedApp.createdDateTime && +new Date(managedApp.createdDateTime),
        lastUpdatedOn:
          managedApp.lastModifiedDateTime &&
          +new Date(managedApp.lastModifiedDateTime),
        isFeatured: managedApp.isFeatured, // Indicates that they are featuring this app on their Company Portal
        privacyInformationURL: managedApp.privacyInformationUrl,
        informationURL: managedApp.informationUrl,
        owner: managedApp.owner || undefined, // Ex: Microsoft, Google, Facebook...
        developer: managedApp.developer, // Almost always the same as the owner

        // Line of Business Apps
        version:
          (managedApp as WindowsPhoneXAP).identityVersion ??
          (managedApp as AndroidLobApp).versionName ??
          (managedApp as AndroidLobApp).versionCode ??
          (managedApp as IosLobApp).versionNumber,
        committedContentVersion: (managedApp as MobileLobApp)
          .committedContentVersion,
        packageId: (managedApp as AndroidLobApp).packageId,
      },
    },
  });
}

/**
 * Line of business apps need to be manually uploaded to Azure ensuring that they are custom.
 * All other managed apps go throuhg an app store or a website (webApp).
 *
 * @param dataModel Microsoft datatype for the api response.
 * Examples: "#microsoft.graph.webApp", "#microsoft.graph.managedIOSStoreApp", "#microsoft.graph.androidLobApp"
 */
function isLineOfBusiness(dataModel: string) {
  return dataModel.toLowerCase().includes('lob');
}

/**
 *
 * @param dataModel Microsoft datatype for the api response.
 * Examples: "#microsoft.graph.androidStoreApp", "#microsoft.graph.managedIOSStoreApp", "#microsoft.graph.windowsMobileMSI", "#microsoft.graph.officeSuiteApp"
 */
function isMobile(dataModel: string) {
  return [
    'ios', // matches iPhone managed app types
    'android', // matches Android managed app types
    'mobile', // matches Windows phone app types
    'webApp', // webApps are availble for both mobile and desktop
  ].some((el) => dataModel.toLowerCase().indexOf(el) > -1);
}
