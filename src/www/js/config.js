DEBUG = true;

require.config({
  paths: {
      "cordova": "../cordova-2.6.0-" + DEVICE,
      "jquery": "lib/jquery-1.9.1.min",
      "jquerymobile": "lib/jquery.mobile-1.3.1.min",
      "underscore": "lib/underscore",
      "backbone": "lib/backbone",
      "text": 'lib/text',
      "omplayer": "lib/omplayer.telesur",
      "actionsheet": 'lib/jquery.mobile.actionsheet',
      "phone": "phone",
      "omdata": "omdata",
      "user_interface": "user_interface"

  },

  shim: { // Sets the configuration for your third party scripts that are not AMD compatible
      "backbone": {
            "deps": [ "underscore", "jquery" ],
            "exports": "Backbone"  // attaches "Backbone" to the window object
      },

      "underscore": {
            "deps": [],
            "exports": "_"
      },

      "actionsheet": {
           "deps": [ "jquery"]
      }
  }
});


require([ "jquery", "backbone", "cordova" ], function( $, Backbone, UserInterface ) {

  if (DEBUG) console.log('Initializing with device: ' + DEVICE)

  // Setup jQueyMobile to let Backbone handle navigation
  //$.mobile.linkBindingEnabled = false; // Prevents all anchor click handling
  //$.mobile.hashListeningEnabled = false; // Disabling this will prevent jQuery Mobile from handling hash changes

  // Execute main login
  //this.router = new MobileRouter();


var ui;
var report_list = {};
var selected_slug;



  


// function(JQM, UserInterface) {

 
     $(document).on('pageinit', function(e, pageOptions) {

       target_id = e.target.id;
          
     });



  // });


require(["jquerymobile", 'user_interface'], function(JQM, UserInterface) {

        document.addEventListener("deviceready", function() {
          if (typeof ui == 'undefined') {
            ui = new UserInterface();
            $(".ui-content").height($(window).height() - $(".ui-footer").height() - $(".ui-header").height()-30);
          }
          ui.phone.init();

        },false);


       $(document).on('pagechange', function(e, pageOptions) {
        ui.setContetSize(pageOptions.toPage[0].id);
        switch (pageOptions.toPage[0].id) {
            case "listPage":
              break;
            case "showReport":
              ui.showReport();
          }
      });


       if(ui){
          ui.init();
          //ui.setContetSize(e.target.id);
          ui.setContetSize(target_id);
        } else {
          ui.init();
          ui.setContetSize(target_id);
        }
        switch (target_id) {
            case "listPage":
              ui.setListPage();
              break;
          case "showReport":
              ui.showReport();
              break;
          case "createReport":
              ui.setCreatePage();
              ui.capturePhoto();
              break;
          }

});



});
