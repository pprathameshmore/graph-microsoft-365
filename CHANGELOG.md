# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 3.0.0 - 2020-03-18

### Updated

- `jupiterone.md` and `development.md` documentation to include descriptions for
  scopes.

### Changed

- the `intune_managed_device` to `intune_detected_application` relationship
  class from **HAS** to **INSTALLED**
- `intune_managed_device` to `intune_detected_application` relationships to
  include `installedVersion`, and `detectionId` properties and allow multiple
  relationships to the same application based on the `detectionId`
- the `_key` property on `intune_detected_application` from the device id to
  `IntuneDetected:` plus the application name
- the `_key` property on `intune_managed_application` from the device id to
  `IntuneManaged:` plus the application name

### Added

- New relationships

  - Intune
    - `intune_managed_application` **MANAGES** `intune_detected_application`

- `mobileDeviceManagementAuthority`, `intuneSubscriptionState`, and
  `intuneAccountId` properties to `intune_managed_device` entities

### Changed

- Only ingest Intune data if the Microsoft 365 account has Intune configured
- A dummy `Account` entity will no longer be created when there is an error
  fetching organization data. Instead, the integration will fail and a message
  will be sent to the user in the job log.

### Added

- A class of `CompliancePolicy` to `intune_compliance_policy` and
  `intune_device_configuration` entities
- `category` property to `intune_compliance_policy` and
  `intune_device_configuration` entities.

- Support for ingesting the following **new** resources

- New relationships

  - Intune
    - `intune_host_agent` **ASSIGNED** `intune_compliance_policy`
    - `intune_host_agent` **ASSIGNED** `intune_device_configuration`
    - `intune_host_agent` **MANAGES** `computer`
    - `intune_host_agent` **MANAGES** `desktop`
    - `intune_host_agent` **MANAGES** `laptop`
    - `intune_host_agent` **MANAGES** `server`
    - `intune_host_agent` **MANAGES** `smartphone`
    - `intune_host_agent` **MANAGES** `user_endpoint`
    - `intune_host_agent` **MANAGES** `workstation`

- New entities

  - Intune
    - `intune_host_agent`

### Removed

- Removed relationships

  - Intune
    - `computer` **ASSIGNED** `intune_compliance_policy`
    - `computer` **USES** `intune_device_configuration`
    - `desktop` **ASSIGNED** `intune_compliance_policy`
    - `desktop` **USES** `intune_device_configuration`
    - `laptop` **ASSIGNED** `intune_compliance_policy`
    - `laptop` **USES** `intune_device_configuration`
    - `server` **ASSIGNED** `intune_compliance_policy`
    - `server` **USES** `intune_device_configuration`
    - `smartphone` **ASSIGNED** `intune_compliance_policy`
    - `smartphone` **USES** `intune_device_configuration`
    - `user_endpoint` **ASSIGNED** `intune_compliance_policy`
    - `user_endpoint` **USES** `intune_device_configuration`
    - `workstation` **ASSIGNED** `intune_compliance_policy`
    - `workstation` **USES** `intune_device_configuration`

### Updated

- README.md to include CI build badges

### Changed

- The type of `intune_managed_device` was changed to more accurately describe
  the hardware of the device. The new device types are `user_endpoint`,
  `workstation`, `laptop`, `desktop`, `computer`, `smartphone`, `tablet`
- The class of `intune_managed_device` only includes `Device` if the device is
  not a virtual machine

### Added

- `deviceType` and `function` properties to `intune_managed_device` entities
- `function` property to `intune_device_configuration` entities

- Support for ingesting the following **new** resources

- New relationships

  - Intune
    - `intune_managed_device` **ASSIGNED** `intune_compliance_policy`
    - `intune_compliance_policy` **IDENTIFIED** `intune_noncompliance_finding`

- New entities

  - Intune
    - `intune_compliance_policy`

## 2.1.1 - 2020-03-05

### Added

- `compliance` key to `intune_managed_device` entities

## 2.1.0 - 2020-03-05

### Changed

- The class of `intune_managed_device` entities from `Device` to
  `[Device, Host]`

## 2.0.0 - 2020-03-01

### Added

- Support for ingesting the following **new** resources

- New relationships

  - Intune
    - `azure_user` **HAS** `intune_managed_device`
    - `intune_managed_device` **USES** `intune_device_configuration`
    - `intune_device_configuration` **IDENTIFIED**
      `intune_noncompliance_finding`
    - `intune_managed_device` **HAS** `intune_noncompliance_finding`
    - `intune_managed_device` **HAS** `intune_detected_application`
    - `intune_managed_device` **ASSIGNED** `intune_managed_application`

- New entities

  - Intune
    - `intune_managed_device`
    - `intune_device_configuration`
    - `intune_noncompliance_finding`
    - `intune_managed_application`
    - `intune_detected_application`

### Updated

- Updated jupiterone.md documentation.
- Microsoft Graph client to handle individual api calls as well as iterative
  calls.
- The severity of an `unknown` finding from 1 to 4

### Changed

- Azure Active Directory entities and relationships to have a type of `azure_`
  to match [the Azure graph project](https://github.com/JupiterOne/graph-azure)

### Fixed

- Sporatic authentication bug with Microsoft Graph sdk.

## 1.0.1 - 2020-02-10

### Updated

- Updated documentation.

## 1.0.0 - 2020-02-05

Initial beta release.

## 0.0.0 - 2020-01-25

Initial commit.
