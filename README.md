# Notifications Quickstart for Node.js
[![Build Status](https://travis-ci.org/TwilioDevEd/notifications-quickstart-node.svg?branch=master)](https://travis-ci.org/TwilioDevEd/notifications-quickstart-node)

This application should give you a ready-made starting point for integrating notifications into your
own apps with Twilio Notifications.

# Configure Twilio account information
Before we begin, we need to collect the credentials we need to run the application.

Credential | Description
---------- | -----------
Twilio Account SID | Your main Twilio account identifier - [find it in the console](https://www.twilio.com/console).
Twilio Notification_Service SID | Use the create_service.js script to generate this. Just run 'node create_service.js' in your terminal, after you add the above configuration values to the `config.js` file.
Twilio Account Auth Token | Your Twilio authentication token - [find it in the console](https://www.twilio.com/console)

# Configure Notify push credentials
You will need to create a Notify Service through the [Twilio Console](https://www.twilio.com/console/notify/services), and add at least one credential on the [Mobile Push Credential screen](https://www.twilio.com/console/notify/credentials) (such as Apple Push Notification Service or Firebase Cloud Messaging for Android) to send notifications using Notify.

For help with setting up native mobile push credentials, please see the following guides:
[Set up push credentials for iOS push notifications](https://www.twilio.com/docs/api/chat/guides/push-notifications-ios)
[Set up push credentials for Android push notifications](https://www.twilio.com/docs/api/chat/guides/push-notifications-android)

# Setting up the Node.js Application

Edit the `config.js` file with the Twilio account information collected in the first step above, including your Twilio account SID, Notification Service SID, and Twilio auth token.

Next, we need to install our dependencies from npm:

```bash
npm install
```

Now we should be all set! Run the application using the `npm` command.

```bash
npm start
```

Your application should now be running at [http://localhost:3000](http://localhost:3000).

# Usage

When your app receives a 'registration' in the form of a POST request to the /register endpoint from a mobile client, it will create a binding. A binding is the address Twilio gives your app installation. It lets our service know where to send notifications.

To send a notification to the client run the notify script

```bash
  node notify IDENTITY_HERE
```

The mobile client will receive a notification with the hardcoded 'Hello {IDENTITY}' message.

That's it! Check out our REST API [docs](http://www.local.twilio.com/docs/api/notifications/rest/overview) for more information on Twilio Notifications.

## License

MIT
