# Integration with JupiterOne

JupiterOne provides a managed integration for Microsoft 365. The integration
connects directly to Microsoft Graph APIs to obtain metadata about the target
organization and analyze resource relationships.

Customers authorize access by creating an App Registration for their
organization only and providing the credentials to allow JupiterOne to run as
that application.

## Setup

To create the App Registration:

1. Go to your Azure portal
1. Navigate to **App registrations**
1. Create a new App registration, using the **Name** "JupiterOne", selecting
   **Accounts in this organizational directory only**, with **no** "Redirect
   URI"
1. Navigate to the **Overview** page of the new app
1. Copy the **Application (client) ID**
1. Copy the **Directory (tenant) ID**
1. Navigate to the **Certificates & secrets** section
1. Create a new client secret
1. Copy the generated secret (you only get one chance!)

Grant permission to read Microsoft Graph information:

1. Navigate to **API permissions**, choose **Microsoft Graph**, then
   **Application Permissions**
1. Grant `Directory.Read.All` permissions to allow reading users, groups, and
   members of groups, including organization contacts and Microsoft Intune
   devices
1. Grant admin consent for this directory for the permissions above

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
