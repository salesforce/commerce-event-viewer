## Salesforce Commerce Diagnostics Viewer

A simple TypeScript application that:

* uses the nforce library to connect and authorize to a Salesforce org
* uses the faye library to connect to the Salesforce Streaming API and subscribe to the CommerceDiagnosticEvent platform event
* serves a webpage that dynamically displays the received CommerceDiagnosticEvents as they are emitted 

### Setup Your Org
1. Make sure you have an active B2B Commerce webstore
1. In your org, create a connected app: https://help.salesforce.com/articleView?id=connected_app_create.htm
1. Make sure to follow the steps for OAuth 2.0 authentication in the section `Enable OAuth Settings for API Integration`
1. OAuth should point to this app's URL like so     `http://localhost:5000/oauth/_callback` or `https://app-name.herokuapp.com/oauth/_callback`

### Setup Heroku
1. Create a heroku account at https://heroku.com (only necessary if hosting on heroku)
1. Get the CLI: https://devcenter.heroku.com/articles/heroku-cli

### Configuration Variables Reference
- **SF_CLIENT_ID**, enter the Consumer Key of your Salesforce Connected App
- **SF_CLIENT_SECRET**, enter the Consumer Secret of your Salesforce Connected App
- **SF_USER_NAME**, enter the the username of your Salesforce user
- **SF_USER_PASSWORD**, enter the the password of your Salesforce user
- (OPTIONAL) **SF_LOGIN_SRV**, enter the login server name (optional, defaults to `login.salesforce.com`, if you want sandbox set this to `test.salesforce.com`)
- (OPTIONAL) **REDIRECT_URL** to the URL of the app itself (optional, defaults to `https://app-name.herokuapp.com/oauth/_callback`)

### Running locally

1. Run `npm install` to get dependencies
1. Run `npm run build` to compile TypeScript files 
1. Copy `.env.tmpl` to `.env`
1. Edit `.env` and set the configuration values (see above).  Set REDIRECT_URL to `http://localhost:5000/oauth/_callback`
1. Start the app:
```
    heroku local
```
### Running on Heroku

1. Run these commands (do not fill in the config values)
```
    heroku apps:create <your-app-name>
    heroku labs:enable runtime-dyno-metadata
    heroku config:set SF_CLIENT_ID=foo SF_CLIENT_SECRET=bar SF_USER_NAME=foo@bar.com SF_USER_PASSWORD=xyz
```
2. Go to the settings page on heroku for your app, and update the configuration settings for SF_CLIENT_ID, etc..
3. Now run:
```
    git push heroku master
    heroku open
```

## Based on
Code is based on these two repos:
* https://github.com/jonmountjoy/salesforce-platform-event-subscriber
* https://github.com/ccoenraets/northern-trail-manufacturing
