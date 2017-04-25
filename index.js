var _ = require('lodash');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var env = require('./config.js');
var twilio = require('twilio');
var FB = require('fb');

// Create Express Webapp
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Basic health check - check environment variables have been configured
// correctly
app.get('/', function(request, response) {

  response.render('index.jade',{
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN,
    TWILIO_NOTIFICATION_SERVICE_SID: env.TWILIO_NOTIFICATION_SERVICE_SID,

  });

});

function createBinding(opts, response){
  // Authenticate with Twilio
  var client = new twilio(env.TWILIO_ACCOUNT_SID,  env.TWILIO_AUTH_TOKEN);

  // Get a reference to the user notification service instance
  var service = client.notify.v1.services(env.TWILIO_NOTIFICATION_SERVICE_SID);

  var execCreateBinding = function(){

    var params =
      {
        "identity": opts.identity,
        "bindingType": opts.BindingType,
        "address": opts.Address
      };

    if (!_.isUndefined(opts.endpoint)) {
      params.endpoint = opts.endpoint;
    }

    service.bindings.create(params).then(function(binding) {
      var message = 'Binding created!';
      console.log(binding);
      // Send a JSON response indicating success
      response.send({
        endpoint: binding.endpoint,
        message: message
      });
    }).catch(function(error) {
      var message = 'Failed to create binding: ' + error;
      console.log(message);

      // Send a JSON response indicating an internal server error
      response.status(500).send({
        error: error,
        message: message
      });
    });

  }

  // For APNS bindings let's check if the app's provisioning profile is aligned
  // with that of the configured certificate.
  // Typically this check is unnecessary and wasteful in production but very
  // useful if you are doing this the first time so we recommend removing it
  // before deploying to production.
  if (opts.BindingType === "apn"){

    service.fetch().then(function(serviceObj){
      return client.notify.v1.credentials(serviceObj.apnCredentialSid).fetch();
    }).then(function(credential){
      if (credential.sandbox !== opts.Sandbox){
        var message = "Mismatched APNS certificate. Make sure you are using a production certificate with a production provisioning profile and a development certificate with a development provisioning profile.";
        console.log(message);
        console.log("Credential's sandbox value: " + credential.sandbox);
        console.log("App's sandbox value: " + opts.Sandbox);
        response.status(400).send({
          error: "52134",
          message: message
        });
      } else{
        execCreateBinding();
      }
    }).catch(function(error){
      console.log(error);
      response.status(500).send({
        error: error,
        message: "Failed to create binding: " + error
      });
    });
  } else { //if not APNS binding we can just go ahead and create the Binding
    execCreateBinding();
  }
}

//Create a binding using device properties
app.post('/register', function(request, response) {
  createBinding(request.body,
    response);
});

//Create a facebook-messenger binding based on the authentication webhook from Facebook
app.post('/messenger_auth', function(request, response) {
  //Extract the request received from Facebook
  var message = request.body.entry[0].messaging[0];
  console.log(message);
  // Set user identity using their fb messenger user id
  var identity = message.sender.id;
  //Let's create a new facebook-messenger Binding for our user
  createBinding({
      "identity":identity,
      "bindingType":'facebook-messenger',
      "address":message.sender.id
    },
    response);
});

//Verification endpoint for Facebook needed to register a webhook.
app.get('/messenger_auth', function(request, response) {
  console.log(request.query["hub.challenge"]);
  response.send(request.query["hub.challenge"]);
});



// Start HTTP server
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
});
