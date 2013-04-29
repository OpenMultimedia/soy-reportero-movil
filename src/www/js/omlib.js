/** @enum {number} */
var ReportStatus = {
  /** Recién creado */
  Created: 1,
  /** Esperando selección de archivo multimedia */
  MediaCapturing: 2,

  MediaCaptured: 3,
  /** Esperando subida de archivo multimedia */
  MediaUploading: 4,

  MediaUploaded: 5,
  /** Archivo multimedia seleccionado, editando */
  Publishing: 6,

  Published: 7
};

var ReportEvent = {
  CaptureSuccess: 'capture_success',
  CaptureError: 'capture_error',
  UploadSuccess: 'upload_success',
  UploadError: 'upload_error',
  PublishSuccess: 'publish_success',
  PublishError: 'publish_error'
};

var MediaType = {
  Picture: 'picture',
  Video: 'video'
};

var MediaSource = {
  Camera: 'camera',
  Library: 'library'
};

var CordovaDevice = {
  triggerReadyAsync_: function() {
    setTimeout(_.bind(this.onReady_, this), 0);
  },
  onReady_: function() {
    this.ready_ = true;
    this.trigger('ready');
  },
  isReady: function() {
    return this.ready_;
  },
  supportsMedia: function(type, source) {
    //TODO: Definir que medios son realmente soportados
    return true;
  },
  ensureReady: function(func) {
    if (this.isReady())
      func();
    else
      this.on('ready', func);
  }
};

var currentDate = new Date();

_.extend(CordovaDevice, Backbone.Events);

document.addEventListener('deviceready', _.bind(CordovaDevice.triggerReadyAsync_, CordovaDevice), false);

var Report = function(manager, id) {
  this.manager_ = manager;
  this.id_ = id;
  this.status_ = ReportStatus.Created;
};

Report.prototype.getStatus = function() {
  return this.status_;
};

Report.prototype.setStatus = function(newStatus) {
  console.log("Changing report status to: ", newStatus);
  this.status_ = newStatus;
};

Report.prototype.setFileUri = function(file_uri) {
  this.file_uri_ = file_uri;
};

Report.prototype.getFileUri = function() {
  return this.file_uri_;
};

Report.prototype.setFileId = function(file_id) {
  this.file_id_ = file_id;
};

Report.prototype.getFileId = function() {
  return this.file_id_;
};

Report.prototype.setInfo = function(info) {
  this.info_ = info;
};

Report.prototype.getInfo = function(info) {
  return this.info_;
};

Report.prototype.setTipoReporte = function(tipo) {
  this.tipoReporte_ = tipo;
};

Report.prototype.getTipoReporte = function(tipo) {
  return this.tipoReporte_;
};

var ReportManager = function() {
  this.currentReport_ = -1;
  this.capturing_ = false;
  this.reports_ = [];
};

_.extend(ReportManager.prototype, Backbone.Events);

ReportManager.prototype.newReport = function() {
  var newId = this.reports_.length;
  this.reports_[newId] = new Report(this, newId);
  this.selectReport(newId);
  return this.getCurrentReport();
};

ReportManager.prototype.selectReport = function(id) {
  if (id < 0 || id >= this.reports_.length)
    throw new Error('No existe un reporte con el id ' + id);

  if (this.isCapturing() || this.isUploading() || this.isPublishing()) {
    throw new Error('Occupied');
  }

  this.currentReport_ = id;
};

ReportManager.prototype.isCapturing = function() {
  return this.capturing_;
};

ReportManager.prototype.isUploading = function() {
  return this.uploading_;
};

ReportManager.prototype.isPublishing = function() {
  return this.publishing_;
};

ReportManager.prototype.onSelectFileSuccess_ = function(uri) {
  //if (uri.indexOf('file://') !== 0) {
  //  uri = 'file://' + uri;
  //}

  this.capturing_ = false;
  this.getCurrentReport().setFileUri(uri);
  this.getCurrentReport().setStatus(ReportStatus.MediaCaptured);
  this.trigger(ReportEvent.CaptureSuccess, uri);
};

ReportManager.prototype.onSelectFileError_ = function(error) {
  this.capturing_ = false;
  this.getCurrentReport().setStatus(ReportStatus.Created);
  this.trigger(ReportEvent.CaptureError, error);
};

ReportManager.prototype.onCaptureSuccess_ = function(mediaFiles) {
  this.onSelectFileSuccess_(mediaFiles[0].fullPath);
};

ReportManager.prototype.onCaptureError_ = function(error) {
  //FIXME: ¿Se regresa a estado Created o se deberia agregar un estado intermedio?
  this.getCurrentReport().setStatus(ReportStatus.Created);
  this.onSelectFileError_(error);
};

ReportManager.prototype.onUploadSuccess_ = function(data) {
  data = $.parseJSON(data.response);

  this.uploading_ = false;
  console.log('File uploaded: ', data);
  this.getCurrentReport().setFileId(data['id']);
  this.getCurrentReport().setStatus(ReportStatus.MediaUploaded);
  this.trigger(ReportEvent.UploadSuccess);
};

ReportManager.prototype.onUploadError_ = function(error) {
  this.uploading_ = false;
  this.getCurrentReport().setStatus(ReportStatus.MediaCaptured);
  this.trigger(ReportEvent.UploadError, error);
};

ReportManager.prototype.capture = function(type, source) {
  if (!CordovaDevice.supportsMedia(type, source))
    throw new Error('Media type and source unsupported: ' + type + '/' + source);

  this.capturing_ = true;

  this.getCurrentReport().setStatus(ReportStatus.MediaCapturing);
  if (type == MediaType.Video)
    this.getCurrentReport().setTipoReporte(TipoReporte.Video);
  else
    this.getCurrentReport().setTipoReporte(TipoReporte.Imagen);

  if (source == MediaSource.Camera) {
    if (type == MediaType.Video) {
      navigator.device.capture.captureVideo(
        _.bind(this.onCaptureSuccess_, this),
        _.bind(this.onCaptureError_, this),
        {limit: 1}
      );
    } else {
      navigator.device.capture.captureImage(
        _.bind(this.onCaptureSuccess_, this),
        _.bind(this.onCaptureError_, this),
        {limit: 1}
      );
    }
  } else { // if (source == MediaSource.Library)

    var phonegapMediaType = (type == MediaType.Video) ?
      Camera.MediaType.VIDEO : Camera.MediaType.PICTURE;

    navigator.camera.getPicture(
      _.bind(this.onSelectFileSuccess_, this),
      _.bind(this.onSelectFileError_, this),
      {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: phonegapMediaType
      });
  }
};

ReportManager.prototype.onUploadProgress_ = function(progressEvent) {
  progressEvent.percentLoaded = 0;

  if (progressEvent.lengthComputable) {
    progressEvent.percentLoaded = Math.floor(100 * progressEvent.loaded / progressEvent.total);
  }

  this.trigger(ReportEvent.UploadProgress, progressEvent);
};

ReportManager.prototype.upload = function() {
  var report = this.getCurrentReport();

  if (report.getStatus() != ReportStatus.MediaCaptured)
    throw new Error('Report must be in MediaCaptured status to be uploaded');

  this.uploading_ = true;

  report.setStatus(ReportStatus.MediaUploading);

  var states = {};
  states[Connection.UNKNOWN] = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI] = 'WiFi connection';
  states[Connection.CELL_2G] = 'Cell 2G connection';
  states[Connection.CELL_3G] = 'Cell 3G connection';
  states[Connection.CELL_4G] = 'Cell 4G connection';
  states[Connection.NONE] = 'No network connection';
  //resolve file check size and upload

  var imageURI = report.getFileUri();

  var options = new FileUploadOptions();
  options.fileKey = 'file';
  options.chunkedMode = false;
  options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
  options.params = {};

  this.ft_ = new FileTransfer();

  this.ft_.onprogress = _.bind(this.onUploadProgress_, this);

  this.ft_.upload(imageURI, encodeURI('https://upload.openmultimedia.biz/files/'),
    _.bind(this.onUploadSuccess_, this),
    _.bind(this.onUploadError_, this),
    options,
    true);
};

ReportManager.prototype.uploadAbort = function() {
  if (this.isUploading()) {
    this.ft_.abort();
  }
};

ReportManager.prototype.onPublishSuccess_ = function(dato, textStatus, jqXHR) {
  this.publishing_ = false;
  this.getCurrentReport().setStatus(ReportStatus.Published);
  var response = JSON.parse(jqXHR['responseText']);
  console.log('Published', response);
  this.trigger(ReportEvent.PublishSuccess, response);
};

ReportManager.prototype.onPublishError_ = function(jqXHR, textStatus, errorThrown){
  this.publishing_ = false;
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
  this.trigger(ReportEvent.PublishError, errorThrown);
};

ReportManager.prototype.signRequest = function(params_dict, key, secret) {
  function sorted_keys(obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
      {
        keys.push(key);
      }
    }
    return keys.sort();
  }

  params_dict['key'] = key;
  cadena = secret;
  var i = 0;
  var sorted_k = sorted_keys(params_dict);
  for (i = 0; i < sorted_k.length; i++) {
    var new_key = sorted_k[i];
    cadena += new_key + params_dict[new_key];
  }
  return md5(cadena);
};

ReportManager.prototype.publish = function() {
  this.publishing_ = true;
  this.getCurrentReport().setStatus(ReportStatus.Publishing);

  var data = this.getCurrentReport().getInfo();

  data['tipo'] = 'soy-reportero';
  data['archivo'] = this.getCurrentReport().getFileId();

  var security_key = 'k4}"-^30C$:3l04$(/<5"7*6|Ie"6x';
  var key = 'telesursoyreporteroplonepruebas';
  var signature = this.signRequest(data, key, security_key);

  data['signature'] = signature;

  console.log('Publishing with : ', data);

  var apiUrl;

  if (this.getCurrentReport().getTipoReporte() == TipoReporte.Video) {
    apiUrl = 'http://multimedia.tlsur.net/api/clip/';
  } else {
    apiUrl = 'http://multimedia.tlsur.net/api/imagen/';
  }

  $.ajax({
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: apiUrl,
    dataType: "json",
    data: data,
    success: _.bind(this.onPublishSuccess_, this),
    error: _.bind(this.onPublishError_, this)
  });
};

ReportManager.prototype.getCurrentReport = function() {
  return this.currentReport_ >= 0 ? this.reports_[this.currentReport_] : this.newReport();
};

TipoReporte = {
  Video: 'Video',
  Imagen: 'Foto'
};

function ApiStream(opt_options) {
  opt_options = opt_options || {};

  this.pageSize_ = opt_options['pageSize'] || 10;

  this.loadingPics_ = false;
  this.loadingpics_ = false;

  this.reset();
}

_.extend(ApiStream.prototype, Backbone.Events);


ApiStream.prototype.parseDate_ = function(dateString) {
  var parts = dateString.split(' ', 2);
  var dateParts = parts[0].split('-', 3);
  var timeParts = parts[1].split(':', 3);

  var date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);

  return date;
};

ApiStream.prototype.createObjectFromClip_ = function(clip) {

  var fecha = this.parseDate_(clip['fecha']);

  var fecha_texto = '' + fecha.getDate() + '/' + (fecha.getMonth() + 1) +  '/' + fecha.getFullYear();

  var formatoFecha = 'dd de MMMM' + ((fecha.getYear() != currentDate.getYear()) ? ', yyyy' : '');
  var fecha_verbose = $.format.date(fecha, formatoFecha);

  return {
    'slug': clip['slug'],
    'titulo': clip['titulo'],
    'descripcion': clip['descripcion'],
    'usuario': clip['usuario_creacion'], //TODO:

    'fecha': fecha,
    'fecha_texto': fecha_texto,
    'fecha_verbose': fecha_verbose,

    'tipo': TipoReporte.Video,

    'archivo': clip['archivo_url'],
    'thumbnail_pequeno': clip['thumbnail_pequeno'],
    'thumbnail_mediano': clip['thumbnail_mediano'],
    'thumbnail_grande': clip['thumbnail_grande'],

    //TODO: Seleccionar mejor thumbnail
    'thumbnail': clip['thumbnail_pequeno'],

    'duracion': clip['duracion']
  };
};

ApiStream.prototype.createObjectFromPic_ = function(image) {
  var fecha = this.parseDate_(image['fecha']);

  var fecha_texto = '' + fecha.getDate() + '/' + (fecha.getMonth() + 1) +  '/' + fecha.getFullYear();

  return {
    'slug': image['slug'],
    'titulo': image['titulo'],
    'descripcion': image['descripcion'],
    'usuario': image['usuario'], //TODO:

    'fecha': fecha,
    'fecha_texto': fecha_texto,

    'tipo': TipoReporte.Imagen,

    'archivo': image['archivo'],
    'thumbnail_pequeno': image['thumbnail_pequeno'],
    'thumbnail_mediano': image['thumbnail_mediano'],
    'thumbnail_grande': image['thumbnail_grande'],
    //TODO: Cual es la imagen a usar
    'thumbnail': image['thumbnail_pequeno']
  };
};

ApiStream.prototype.addToCache_ = function(reportList) {
  for (var i = 0; i < reportList.length; i += 1) {
    var report = reportList[i];
    this.cached_[report.slug] = report;
  }
};

ApiStream.prototype.fromCache = function(slug) {
  return this.cached_[slug];
};

ApiStream.prototype.isLoading = function() {
  return this.loadingPics_ || this.loadingClips_;
};

ApiStream.prototype.reset = function() {
  //console.log('Api reset...');
  if (this.isLoading()) {
    throw new Error("There is a loading operation in progress");
  }

  this.lastPage_ = -1;

  this.clips_ = [];
  this.clipOffset_ = 0;

  this.pics_ = [];
  this.picOffset_ = 0;

  this.cached_ = {};

  this.trigger('reset');
};

ApiStream.prototype.more = function() {
  //console.log('Loading more...');
  if (this.isLoading()) {
    throw new Error("There is a loading operation in progress");
  }

  if (this.clips_.length < this.pageSize_)
      this.moreClips_();

    if (this.pics_.length < this.pageSize_)
      this.morePics_();
};

ApiStream.prototype.moreClips_ = function() {
  this.loadingClips_ = true;

  $.
      getJSON(
        'http://multimedia.tlsur.net/api/clip/?detalle=normal&tipo=soy-reportero&autenticado=w3bt3l3sUrTV&callback=?',
        {'primero': this.clipOffset_ + 1, 'ultimo': this.clipOffset_ + this.pageSize_ - this.clips_.length}
      ).
      done(_.bind(this.onClipsLoaded_, this)).
      fail(_.bind(this.onClipsLoadedError_, this));
};

ApiStream.prototype.morePics_ = function() {
  this.loadingPics_ = true;

  $.
      getJSON(
        'http://multimedia.tlsur.net/api/imagen/?tipo=soy-reportero&autenticado=w3bt3l3sUrTV&callback=?',
        {'primero': this.picOffset_ + 1, 'ultimo': this.picOffset_ + this.pageSize_ - this.pics_.length}
      ).
      done(_.bind(this.onPicsLoaded_, this)).
      fail(_.bind(this.onPicsLoadedError_, this));
};

ApiStream.prototype.onClipsLoaded_ = function(data) {
  //console.log("Loaded clips: ", data)
  var clip;
  for (var i = 0; i < data.length; i += 1) {
    this.clips_.push(this.createObjectFromClip_(data[i]));
  }

  this.clipOffset_ += data.length;
  this.loadingClips_ = false;
  this.onMoreLoaded_();
};

ApiStream.prototype.onClipsLoadedError_ = function(e) {
  console.error(e);
};

ApiStream.prototype.onPicsLoaded_ = function(data) {
  //console.log("Loaded pics: ", data)
  var pic;
  for (var i = 0; i < data.length; i += 1) {
    this.pics_.push(this.createObjectFromPic_(data[i]));
  }

  this.picOffset_ += data.length;
  this.loadingPics_ = false;
  this.onMoreLoaded_();
};

ApiStream.prototype.onPicsLoadedError_ = function(e) {
  console.error(e);
};

ApiStream.prototype.onMoreLoaded_ = function() {
  if (this.isLoading())  return;

  var merged = [];
  var element;

  //TODO: Revisar posibles errores
  while (merged.length < this.pageSize_) {

    if (this.clips_[0]['fecha'] > this.pics_[0]['fecha'])
      element = this.clips_.shift();
    else
      element = this.pics_.shift();

    merged.push(element);
  }

  this.lastPage_ += 1;

  this.addToCache_(merged);

  this.trigger('more', merged);
};
