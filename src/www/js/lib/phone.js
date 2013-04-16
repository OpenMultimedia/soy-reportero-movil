  var pictureSource;   // picture source
  var destinationType; // sets the format of returned value
  var destinationType;
  var mediaType = "image";
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
          var response = JSON.parse(r.response);
          $("#file-id-input").val(response['id']);
          $("#file-id-input").trigger("change");
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
          ft.onprogress = function (progressEvent) {
               if (progressEvent.lengthComputable) {
                   percentLoaded = Math.round(100 * (progressEvent.loaded / progressEvent.total));
                   console.log(percentLoaded);
                   $(".progressbar-container").css("display", "block");
                   $(".progressbar").css("width", percentLoaded + "%");
                   if(percentLoaded >= 99) {
                    $(".progresstext").text("Archivo subido exitosamente");
                   }
               }
           };
          ft.upload(imageURI, encodeURI("https://upload.openmultimedia.biz/files/"), win, fail, options, true);
  }

  function checkConnectionAndSizeAndUpload(imageURI) {
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    //resolve file check size and upload
    if (imageURI.indexOf("file://") !== 0) {
      imageURI = "file://" + imageURI;
    }
    window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
        fileEntry.file(function(fileObj) {
            var networkState = navigator.network.connection.type;
            $(".conextion-type").text("Esta usando: " + states[networkState] + " y el archivo que desea cargar pesa: " + fileObj.size + "bytes, ¿desea continuar?");
            $("#acept-upload-button").click( function() {
                uploadFile(imageURI);
            });
            $("#dialogstarter").trigger("click");
        }, function(e) {
          console.log(e);

        });
    });

  }

  // Called when a photo is successfully retrieved
  //
function onPhotoURISuccess(imageURI) {
    checkConnectionAndSizeAndUpload(imageURI);
}

  // A button will call this function
  //
  function capturePhoto() {
    mediaType = "image";
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI});
  }


  // capture callback
var captureSuccess = function(mediaFiles) {
  var i, path, len;
  for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      path = mediaFiles[i].fullPath;
      console.log(path);
      onPhotoURISuccess(path);
  }
};

// capture error callback
var captureError = function(error) {
  navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};


   function captureVideo() {
    mediaType = "video";
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
  }


  // A button will call this function
  //
  function getPhoto(source, type) {
    mediaType = "image";
    if(type == 1) {
      mediaType = "video";
    }
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
