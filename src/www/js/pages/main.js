
db = null;
$(document).on('pageinit', '#main', function(e, pageOptions) {
  var buttons = [{
    selector: '#capture-photo-button',
    mediaType: MediaType.Picture,
    mediaSource: MediaSource.Camera
  }, {
    selector: '#capture-video-button',
    mediaType: MediaType.Video,
    mediaSource: MediaSource.Camera
  }, {
    selector: '#select-photo-button',
    mediaType: MediaType.Picture,
    mediaSource: MediaSource.Library
  }, {
    selector: '#select-video-button',
    mediaType: MediaType.Video,
    mediaSource: MediaSource.Library
  }];

  for (var i = 0; i < buttons.length; i += 1) {
    var button = buttons[i];
    if (CordovaDevice.supportsMedia(button.mediaType, button.mediaSource)) {
      $(e.target).
        find(button.selector).
        show().
        on('click', _.partial(ui.launchCapture, button.mediaType, button.mediaSource));
    }
  }

  manager.on(ReportEvent.CaptureSuccess, _.bind(ui.onCaptureSuccess, ui));
  manager.on(ReportEvent.CaptureError, _.bind(ui.onCaptureError, ui));
  manager.on(ReportEvent.UploadSuccess, _.bind(ui.onUploadSuccess, ui));
  manager.on(ReportEvent.UploadProgress, _.bind(ui.onUploadProgress, ui));
  manager.on(ReportEvent.UploadError, _.bind(ui.onUploadError, ui));
});

$(document).on('pagebeforeshow', '#main', function(e, pageOptions) {
  var report = manager.getCurrentReport();

  if (report.getStatus() == ReportStatus.Published) {
    report = manager.newReport();
  }

  $("#create-report-button").on("click", function(e) {
    if($("#name-input").val() === "" && $("select#country-input option:selected").val()) {
      navigator.notification.alert("Llene los campos Nombre y País",function() {
    },"Información","Aceptar");
    } else {
      saveData();
      $("#create-report-hidden").trigger("click");
    }
  });

  if ((report.getStatus() > ReportStatus.Created) && (report.getStatus() < ReportStatus.Publishing)) {
    $('#edit-report-button', this).show();
  } else {
    $('#edit-report-button', this).hide();
  }
});



// DATABASE INTERACTION

function querySuccess(db, results) {
  if(results.rows.length != 1) {
    db.executeSql('INSERT INTO USER (id, name, country) VALUES (1, "None", "None")');
  } else {
    var data = results.rows.item(0);
    if (data.name !== "None" && data.country !== "None") {

      $("#name-input").val(data.name);
      $("select#country-input").val(data.country);
      $("select#country-input").selectmenu("refresh", true);
    }
  }
}

function errorQuery() {
  console.log("error el traer los datos");
}

function errorCB(e,v) {
  navigator.notification.alert("Error al cargar la base de datos",function() {
    },"Error","Aceptar");
}

function successCB() {
  console.log("base de datos guardada con exito");
}

function populateDB(db) {
  //db.executeSql('DROP TABLE IF EXISTS MINE');
  db.executeSql('CREATE TABLE IF NOT EXISTS USER (id unique, name VARCHAR(20), country VARCHAR(5))');
  db.executeSql('CREATE TABLE IF NOT EXISTS MINE (id INTEGER PRIMARY KEY AUTOINCREMENT, slug VARCHAR(20), title VARCHAR(20), type VARCHAR(7))');
  db.executeSql('SELECT * FROM USER', [], querySuccess, errorQuery);
}

function saveUserDB(db) {
  var name = $("#name-input").val();
  var country = $("#country-input").val();
  db.executeSql("update USER set name=?, country=? where id=?", [name, country, 1]);
}

//no se donde poner esto.. fuck off!!
CordovaDevice.on('ready', function() {
  db = window.openDatabase("soyReporteroDB", "1.0", "Soy reportero", 200000);
  db.transaction(populateDB, errorCB, successCB);
});

function saveData() {
  db.transaction(saveUserDB, errorCB, successCB);
}
