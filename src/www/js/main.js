// Sets the require.js configuration
require.config( {

      // 3rd party script alias names
      paths: {
            "jquery": "lib/jquery-1.9.1.min",
            "jquerymobile": "lib/jquery.mobile-1.3.0.min",
            "underscore": "lib/underscore-min",
            "backbone": "lib/backbone"
      },

      // Sets the configuration for 3d party scripts that are not AMD compatible
      shim: {
            "backbone": {
                  "deps": [ "underscore", "jquery" ],
                  "exports": "Backbone"  //attaches "Backbone" to the window object
            }
      } // end Shim Configuration

} );

// Includes File Dependencies
require([ "jquery", "backbone", "routers/ClipRouter" ], function($, Backbone, ClipRouter) {

	$(document).on("mobileinit",
		// Set up the "mobileinit" handler before requiring jQuery Mobile's module
		function() {
			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			$.mobile.linkBindingEnabled = false;

			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.mobile.hashListeningEnabled = false;

                  $.mobile.ajaxEnabled = false;
                  $.mobile.pushStateEnabled = false;
		}
	)

	require( [ "jquerymobile" ], function() {
		// Instantiates a new Backbone.js Mobile Router
		this.router = new ClipRouter();
	});
} );
