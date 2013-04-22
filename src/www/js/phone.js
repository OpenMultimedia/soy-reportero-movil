define([ "jquery", "underscore", "backbone", "omdata", "cordova" ], function( $, _, Backbone ) {


  function PhoneAccess(opt_options) {
  }

  _.extend(PhoneAccess.prototype, Backbone.Events);

  PhoneAccess.prototype.init = function() {
    this.pictureSource = navigator.camera.PictureSourceType;
    this.destinationType = navigator.camera.DestinationType;
    this.mediaType = "image";
  };

  PhoneAccess.prototype.capturePhoto = function() {
      this.mediaType = "image";
      // Take picture using device camera and retrieve image as base64-encoded string
      var that = this;
      navigator.camera.getPicture(function(imageURI) {
        that.trigger("captureSuccess", imageURI);
      }, function(error) {
        that.trigger("captureFail", error);
      }, { quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI});
  };

  PhoneAccess.prototype.captureVideo = function() {
      // Take picture using device camera and retrieve image as base64-encoded string
      var that = this;
      this.mediaType = "video";
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.device.capture.captureVideo(
        function(mediaFiles) {
          var i, path, len;
          var imageURI;
          for (i = 0, len = mediaFiles.length; i < len; i += 1) {
              imageURI = path;
              path = mediaFiles[i].fullPath;
              if (path.indexOf("file://") !== 0) {
                imageURI = "file://" + path;
              }
              that.trigger("captureSuccess", imageURI);
          }
        }, function(error) {
          that.trigger("captureFail", error);
        }, {limit:1});
  };

  PhoneAccess.prototype.selectPhoto = function() {
    this.mediaType = "image";
    var that = this;
    navigator.camera.getPicture(function(imageURI) {
        that.trigger("captureSuccess", imageURI);
      }, function(error) {
        that.trigger("captureFail", error);
      }, { quality: 50,
        destinationType: this.destinationType.FILE_URI,
        sourceType: this.pictureSource.PHOTOLIBRARY, mediaType: 0});
  };

  PhoneAccess.prototype.selectVideo = function() {
    this.mediaType = "image";
    var that = this;
    navigator.camera.getPicture(function(imageURI) {
        that.trigger("captureSuccess", imageURI);
      }, function(error) {
        that.trigger("captureFail", error);
      }, { quality: 50,
        destinationType: this.destinationType.FILE_URI,
        sourceType: this.pictureSource.PHOTOLIBRARY, mediaType: 1});
  };

  PhoneAccess.prototype.getConection = function() {
      var states = {};
      states[Connection.UNKNOWN]  = 'Conexión desconocida';
      states[Connection.ETHERNET] = 'conexión ethernet';
      states[Connection.WIFI]     = 'conexión WiFi';
      states[Connection.CELL_2G]  = 'Conexión 2G';
      states[Connection.CELL_3G]  = 'Conexión 3G';
      states[Connection.CELL_4G]  = 'Conexión 4G';
      states[Connection.NONE]     = 'Sin conexión';
      return states[navigator.connection.type];
  };

  PhoneAccess.prototype.fileSize = function(imageURI) {
    var that = this;
    window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
          fileEntry.file(function(fileObj) {
            that.trigger("fileSizeSuccess", fileObj.size);
          });
        });
  };

  //   // Wait for Cordova to connect with the device
  //   //
  //   //document.addEventListener("deviceready",onDeviceReady,false);

  //   // Called when a photo is successfully retrieved
  //   //

  //     function win(r) {
  //           var response = JSON.parse(r.response);
  //           $("#file-id-input").val(response['id']);
  //           $("#file-id-input").trigger("change");
  //       }

  //   function fail(error) {
  //           alert("An error has occurred: Code = " + error.code);
  //           console.log("upload error source " + error.source);
  //           console.log("upload error target " + error.target);
  //       }

  //    function uploadFile(imageURI) {
  //         var options = new FileUploadOptions();
  //           options.fileKey="file";
  //           options.chunkedMode = false;
  //           options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  //           var params = {};
  //           options.params = params;
  //           var ft = new FileTransfer();
  //           ft.onprogress = function (progressEvent) {
  //                if (progressEvent.lengthComputable) {
  //                    percentLoaded = Math.round(100 * (progressEvent.loaded / progressEvent.total));
  //                    console.log(percentLoaded);
  //                    $(".progressbar-container").css("display", "block");
  //                    $(".progressbar").css("width", percentLoaded + "%");
  //                    if(percentLoaded >= 99) {
  //                     $(".progresstext").text("Archivo subido exitosamente");
  //                    }
  //                }
  //            };
  //           ft.upload(imageURI, encodeURI("https://upload.openmultimedia.biz/files/"), win, fail, options, true);
  //   }

  //   function checkConnectionAndSizeAndUpload(imageURI) {
  //     var states = {};
  //     states[Connection.UNKNOWN]  = 'Unknown connection';
  //     states[Connection.ETHERNET] = 'Ethernet connection';
  //     states[Connection.WIFI]     = 'WiFi connection';
  //     states[Connection.CELL_2G]  = 'Cell 2G connection';
  //     states[Connection.CELL_3G]  = 'Cell 3G connection';
  //     states[Connection.CELL_4G]  = 'Cell 4G connection';
  //     states[Connection.NONE]     = 'No network connection';
  //     //resolve file check size and upload
  //     if (imageURI.indexOf("file://") !== 0) {
  //       imageURI = "file://" + imageURI;
  //     }
  //     window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
  //         fileEntry.file(function(fileObj) {
  //             var networkState = navigator.network.connection.type;
  //             $(".conextion-type").text("Esta usando: " + states[networkState] + " y el archivo que desea cargar pesa: " + fileObj.size + "bytes, ¿desea continuar?");
  //             $("#acept-upload-button").click( function() {
  //                 uploadFile(imageURI);
  //             });
  //             $("#dialogstarter").trigger("click");
  //         }, function(e) {
  //           console.log(e);

  //         });
  //     });

  //   }

  //   // Called when a photo is successfully retrieved
  //   //
  // function onPhotoURISuccess(imageURI) {
  //     checkConnectionAndSizeAndUpload(imageURI);
  // }

  //   // A button will call this function
  //   //
  //   function capturePhoto() {
  //     mediaType = "image";
  //     // Take picture using device camera and retrieve image as base64-encoded string
  //     navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
  //       destinationType: navigator.camera.DestinationType.FILE_URI});
  //   }


  //   // capture callback
  // var captureSuccess = function(mediaFiles) {
  //   var i, path, len;
  //   for (i = 0, len = mediaFiles.length; i < len; i += 1) {
  //       path = mediaFiles[i].fullPath;
  //       console.log(path);
  //       onPhotoURISuccess(path);
  //   }
  // };

  // // capture error callback
  // var captureError = function(error) {
  //   navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
  // };


  //    function captureVideo() {
  //     mediaType = "video";
  //     // Take picture using device camera and retrieve image as base64-encoded string
  //     navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1});
  //   }


  //   // A button will call this function
  //   //
  //   function getPhoto(source, type) {
  //     mediaType = "image";
  //     if(type == 1) {
  //       mediaType = "video";
  //     }
  //     // Retrieve image file location from specified source
  //     navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
  //       destinationType: destinationType.FILE_URI,
  //       sourceType: source, mediaType: type});
  //   }

  //   // Called if something bad happens.
  //   //
  //   function onFail(message) {
  //     alert('Failed because: ' + message);
  //   }
  return PhoneAccess;

});
