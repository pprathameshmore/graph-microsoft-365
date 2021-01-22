# MSAL

MSAL is the [Microsoft Authentication Library][msal].

Reading [further][client-apps], it seems this library is intended for use in
user-agent clients, those applications which cannot store secrets and therefore
must obtain temporary credentials:

> The user-agent application is a form of public client application in which the
> client code is executed in a user-agent such as a web browser. These clients
> do not store secrets, since the browser context is openly accessible. In
> MSAL.js, there is no separation of public and confidential client apps.
> MSAL.js represents client apps as user agent-based apps, public clients in
> which the client code is executed in a user agent like a web browser. These
> clients don't store secrets because the browser context is openly accessible.

Additionally, the [Microsoft Graph JavaScript library][msgraph-sdk-js] states:

> Important Note: MSAL is supported only for frontend applications, for
> server-side authentication you have to implement your own
> AuthenticationProvider.

Therefore, at this time, you will not find references to or use of `MSAL.js`.
Please see this project's [API wrapper client](../src/ms-graph/client.ts) for
the little code required to authenticate with stored secrets.

## Useful Links

Release Notes changes affecting MSAL for 2.0.0

- https://github.com/microsoftgraph/msgraph-sdk-javascript/releases/tag/2.0.0

[msal]:
  https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-client-applications
[client-apps]:
  https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications
[msgraph-sdk-js]:
  https://github.com/microsoftgraph/msgraph-sdk-javascript#2-authenticate-for-the-microsoft-graph-service
