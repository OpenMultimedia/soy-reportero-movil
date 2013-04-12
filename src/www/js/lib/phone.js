 var pictureSource;   // picture source
  var destinationType; // sets the format of returned value

  // Wait for Cordova to connect with the device
  //
  document.addEventListener("deviceready",onDeviceReady,false);

  // Cordova is ready to be used!
  //
  function onDeviceReady() {
      pictureSource=navigator.camera.PictureSourceType;
      destinationType=navigator.camera.DestinationType;
  }

  // Called when a photo is successfully retrieved
  //

	function win(r) {
			alert(r.responseCode);
			alert(r.response);
          console.log("Code = " + r.responseCode);
          console.log("Response = " + r.response);
          console.log("Sent = " + r.bytesSent);
          console.log(r);
          console.log("suuubiiooo");
          $("#file-id").val(r.response['id']);
          $("#file-id").trigger("change");
      }

  function fail(error) {
          alert("An error has occurred: Code = " + error.code);
          console.log("upload error source " + error.source);
          console.log("upload error target " + error.target);
      }

   function uploadFile(imageURI) {
   		var options = new FileUploadOptions();
          options.fileKey="file";
          options.chunkedMode = false;
          options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
          var params = {};
          options.params = params;
          var ft = new FileTransfer();
          ft.upload(imageURI, encodeURI("https://upload.openmultimedia.biz/files/"), win, fail, options, true);
  }

  function checkConnectionAndSizeAndUpload(imageURI) {
  	console.log("nuuuu");
  	var states = {};
  	states[Connection.UNKNOWN]  = 'Unknown connection';
  	states[Connection.ETHERNET] = 'Ethernet connection';
  	states[Connection.WIFI]     = 'WiFi connection';
  	states[Connection.CELL_2G]  = 'Cell 2G connection';
  	states[Connection.CELL_3G]  = 'Cell 3G connection';
  	states[Connection.CELL_4G]  = 'Cell 4G connection';
  	states[Connection.NONE]     = 'No network connection';
  	console.log("hhhhheeey");
  	//resolve file check size and upload
  	window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
  		console.log("hoooooo");
      	fileEntry.file(function(fileObj) {
      		var networkState = navigator.network.connection.type;
      		alert("you are using: " + states[networkState]);
  			alert("the file you are trying to upload is: " + fileObj.size + "bytes");
  			uploadFile(imageURI);


      	});
  	});

  }


  function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64 encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
  }




  // Called when a photo is successfully retrieved
  //
  function onPhotoURISuccess(imageURI) {
    console.log("quepasa aca");
    // Uncomment to view the image file URI
    console.log(imageURI);
  checkConnectionAndSizeAndUpload(imageURI);
    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');


  }

  // A button will call this function
  //
  function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    console.log("manshana");
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI});
   console.log("meeeesssi");
  }


  // capture callback
var captureSuccess = function(mediaFiles) {
console.log("hhheeey");
console.log(mediaFiles);
  var i, path, len;
  for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      path = mediaFiles[i].fullPath;
      console.log(path);
      onPhotoURISuccess(path);
      // do something interesting with the file
  }
};

// capture error callback
var captureError = function(error) {
  navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};


   function captureVideo() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
  }


  // A button will call this function
  //
  function getPhoto(source, type) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
      destinationType: destinationType.FILE_URI,
      sourceType: source, mediaType: type});
  }

  // Called if something bad happens.
  //
  function onFail(message) {
    alert('Failed because: ' + message);
  }

  var showConection = function() {
  	var Videos = Backbone.Collection.extend({
	   url:'http://multimedia.tlsur.net/api/clip/'
});
console.log("guuau");
	console.log("miaauu");
	var video = new Videos();
	var result = video.fetch();
	console.log(result);
	console.log("yoursister");
};
