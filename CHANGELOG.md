# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

- New properties added to resources:
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
