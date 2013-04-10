// Clip Model
// ==============

// Includes file dependencies
define(["jquery", "backbone"], function($, Backbone) {

    // The Model constructor
    var Model = Backbone.Model.extend({

    	url: function() {
    		return 'http://multimedia.telesurtv.net/api/clip/';
    	},

    	sync: function(method, model, options) {
		// Default JSON-request options.
		var params = _.extend({
		  type:         'GET',
		  dataType:     'jsonp',
		  url:			model.url(),
		  jsonp: 		"callback"
		  // processData:  false
		}, options);
 
		// Make the request.
		return $.ajax(params);
	},
    });



    // Returns the Model class
    return Model;

} );