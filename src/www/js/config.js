require.config({
  paths: {
      "cordova": "../cordova-2.6.0-" + DEVICE,
      "jquery": "lib/jquery-1.9.1.min",
      "jquerymobile": "lib/jquery.mobile-1.3.1.min",
      "underscore": "lib/underscore",
      "backbone": "lib/backbone"
  },

  shim: { // Sets the configuration for your third party scripts that are not AMD compatible
      "backbone": {
            "deps": [ "underscore", "jquery" ],
            "exports": "Backbone"  // attaches "Backbone" to the window object
      }
  }
});

require([ "cordova", "jquery", "backbone", 'router', "jquerymobile" ], function( Cordova, $, Backbone, Router ) {

  // Prevents all anchor click handling
  $.mobile.linkBindingEnabled = false;

  // Disabling this will prevent jQuery Mobile from handling hash changes
  $.mobile.hashListeningEnabled = false;

  console.log('listo con DEVICE: +' + DEVICE)

  // Instantiates a new Backbone.js Mobile Router
  this.router = new Router();

});
