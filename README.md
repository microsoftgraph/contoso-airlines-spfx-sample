# Contoso Airlines Flight Team Badge WebPart

WORK IN PROGRESS

This sample uses the SharePoint Framework and Microsoft Graph to build a visual display of the members of a flight crew and their "badge" status.

## Setup

After cloning this repository, run `npm install` to install dependencies. Then follow the steps in [Deploy the solution and grant permissions](https://docs.microsoft.com/sharepoint/dev/spfx/use-aad-tutorial#deploy-the-solution-and-grant-permissions).

After deploying the web part, you can add it to SharePoint pages in a team site to see it in action. It will list all users in the team.

To add badge data to users, use Graph Explorer to add an open extension to the user. The request takes the following format:

```http
POST https://graph.microsoft.com/v1.0/users/{user-id}/extensions

{
  "@odata.type": "microsoft.graph.openTypeExtension",
  "extensionName": "com.contoso.badgeData",
  "statusBadges": [
    "first-aid"
  ],
  "progressBadges": [
    {
      "name": "flights",
      "count": 98
    },
    {
      "name": "customer-kudos",
      "count": 1
    },
    {
      "name": "on-time",
      "count": 70
    }
  ]
}
```
