# Development

The [Microsoft Graph API][msgraph-api] provides access to resources in Microsoft
365 services. This project uses a number of JavaScript libraries provided by
Microsoft. Please review the source code for details. None of them are relevant
for getting started.

## Prerequisites

- An Azure account with a registered app that will provide credentials for the
  program to connect to Microsoft Graph APIs.
- An Active Directory to target for ingestion. This would ideally be a Microsoft
  365 account, though it is possible to target an Azure AD for some resources.

## Provider account setup

A JupiterOne staff developer may obtain credentials for existing development
accounts.

For those looking to build out their own development accounts:

1. Obtain a free Azure account, with a hotmail.com email address (one will be
   assigned to you when you create the Azure account, which provisions an Azure
   AD directory).
1. Obtain a Microsoft 365 account, which you'll need to work on ingesting Users,
   Groups, and other organizational resources found in Microsoft Graph. You may
   also make some progress by targeting your Azure AD default directory.

In the Azure portal:

1. Create an App Registration, multi-tenant
1. Add a 1-year secret (store securely in 1Password)
1. Add a couple of Redirect URIs:
   1. https://apps.dev.jupiterone.io/microsoft-365/install (optional, obviously)
   1. https://localhost/microsoft-365/install

## Authentication

JupiterOne is configured in Azure App Registrations as a [multi-tenant
daemon/server application][daemon-app]. The [OAuth 2 client credentials grant
flow][oauth2-client-cred-flow] is executed to obtain consent from an
organization administrator, producing a Service Principal in a tenant that
grants consent to the app. The flow will provide the tenant ID where consent has
been granted, which is stored for use in Microsoft Graph API calls.

Admin consent is granted to JupiterOne by:

1. Log in to JupiterOne as a user with permission to set up an integration
1. Add a Microsoft 365 integration instance
1. You will be directed to Microsoft's identity platform, where you must login
   in as an administrator in the organization you intend to ingest
1. Review requested permissions and grant consent

To exercise the grant flow:

1. Visit the [admin consent URL for jupiterone-dev][admin-consent-j1dev]
1. After being redirected to something like
   `https://localhost/microsoft-365/install?admin_consent=True&tenant=tenant-id&state=12345`,
   capture the `tenant` query param

Use this `tenant` ID and information from the App Registration to create a
`.env` file for local execution of the daemon/server application (this
repository):

```
CLIENT_ID='885121e7-c3c6-4378-8f6b-e315cc5994ce'
CLIENT_SECRET='<top secret passphrase>'
DIRECTORY_ID='<tenant id>'
```

This will be used to auto-populate the
[authentication configuration](../src/instanceConfigFields.json).

[msgraph-api]: https://docs.microsoft.com/en-us/graph/overview
[daemon-app]:
  https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-daemon-overview
[oauth2-client-cred-flow]:
  https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#protocol-diagram
[admin-consent-j1dev]:
  https://login.microsoftonline.com/common/adminconsent?client_id=885121e7-c3c6-4378-8f6b-e315cc5994ce&state=12345&redirect_uri=https://localhost/microsoft-365/install
