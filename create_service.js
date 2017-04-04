var env = require('./config.js');
var twilio = require('twilio');

// Authenticate with Twilio
var client = new twilio(env.TWILIO_ACCOUNT_SID,  env.TWILIO_AUTH_TOKEN);

// Create a user notification service instance
var serviceData = {
  friendlyName: 'My First Notifications App'
}

if (env.TWILIO_APN_CREDENTIAL_SID != "") {
  serviceData.apnCredentialSid = env.TWILIO_APN_CREDENTIAL_SID
  console.log("Adding APN Credentials to service")
} else {
  console.log("No APN Credentials configured - add in config.js, if available.")
}

if (env.TWILIO_FCM_CREDENTIAL_SID != "") {
  serviceData.fcmCredentialSid = env.TWILIO_FCM_CREDENTIAL_SID
  console.log("Adding FCM Credentials to service")
} else {
  console.log("No FCM Credentials configured - add in config.js, if available.")
}

client.notify.v1.services.create(serviceData).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.log(error);
});
