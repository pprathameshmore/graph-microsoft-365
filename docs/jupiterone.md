# Integration with JupiterOne

JupiterOne provides a managed integration for Microsoft 365. The integration
connects directly to Microsoft Graph APIs to obtain metadata about the target
organization and analyze resource relationships.

## Setup

Authorize access to JupiterOne:

1. Log in to JupiterOne as a user with permission to set up an integration
1. Add a Microsoft 365 integration instance
1. You will be directed to Microsoft's identity platform, where you must login
   in as an administrator in the organization you intend to integrate
1. Review requested permissions and grant consent

## Data Model

### Entities

The following entity resources are ingested when the integration runs.

| Microsoft 365 Resources | \_type of the Entity            | \_class of the Entity |
| ----------------------- | ------------------------------- | --------------------- |
| Account                 | `active_directory_account`      | `Account`             |
| Group                   | `active_directory_user_group`   | `UserGroup`           |
| Group Member            | `active_directory_group_member` | `User`                |
| User                    | `active_directory_user`         | `User`                |

### Relationships

The following relationships are created/mapped:

| From                          | Edge    | To                              |
| ----------------------------- | ------- | ------------------------------- |
| `active_directory_account`    | **HAS** | `active_directory_user`         |
| `active_directory_account`    | **HAS** | `active_directory_user_group`   |
| `active_directory_user_group` | **HAS** | `active_directory_user`         |
| `active_directory_user_group` | **HAS** | `active_directory_user_group`   |
| `active_directory_user_group` | **HAS** | `active_directory_group_member` |
