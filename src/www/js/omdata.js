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
  return {
    'slug': clip['slug'],
    'titulo': clip['titulo'],
    'descripcion': clip['descripcion'],
    'usuario': clip['usuario_creacion'], //TODO:
    'fecha': this.parseDate_(clip['fecha']),

    'tipo': TipoReporte.Video,

    'archivo': clip['archivo_url'],
    'thumbnail_pequeno': clip['thumbnail_pequeno'],
    'thumbnail_mediano': clip['thumbnail_mediano'],
    'thumbnail_grande': clip['thumbnail_grande'],

    'duracion': clip['duracion']
  };
};

ApiStream.prototype.createObjectFromPic_ = function(image) {
  return {
    'slug': image['slug'],
    'titulo': image['titulo'],
    'descripcion': image['descripcion'],
    'usuario': image['usuario'], //TODO:
    'fecha': this.parseDate_(image['fecha']),

    'tipo': TipoReporte.Imagen,

    'archivo': image['archivo'],
    'thumbnail_pequeno': image['thumbnail_pequeno'],
    'thumbnail_mediano': image['thumbnail_mediano'],
    'thumbnail_grande': image['thumbnail_grande']
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
}

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

