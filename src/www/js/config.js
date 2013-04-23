DEBUG = true;

require.config({
  paths: {
      "cordova": "../cordova-2.6.0-" + DEVICE,
      "jquery": "lib/jquery-1.9.1.min",
      "jquerymobile": "lib/jquery.mobile-1.3.1",
      "underscore": "lib/underscore",
      "backbone": "lib/backbone",
      "text": 'lib/text',
  },

  shim: { // Sets the configuration for your third party scripts that are not AMD compatible
      "backbone": {
            "deps": [ "underscore", "jquery" ],
            "exports": "Backbone"  // attaches "Backbone" to the window object
      }
  }
});

require([ "cordova", "jquery", "backbone", 'MobileRouter', "jquerymobile" ], function( Cordova, $, Backbone, MobileRouter ) {

  if (DEBUG) console.log('Initializing with device: ' + DEVICE)

  // Setup jQueyMobile to let Backbone handle navigation
  $.mobile.linkBindingEnabled = false; // Prevents all anchor click handling
  $.mobile.hashListeningEnabled = false; // Disabling this will prevent jQuery Mobile from handling hash changes

  // Execute main login
  this.router = new MobileRouter();
});
