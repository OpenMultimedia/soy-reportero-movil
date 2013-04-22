define([ "jquery", "underscore", "backbone", "omdata", "phone", "actionsheet" ], function( $, _, Backbone, ApiStream, PhoneAccess ) {


  function UserInterface(opt_options) {
    this.listCointainer = "#list-reports";
    this.moreButton = "#more";
    this.api = new ApiStream({pageSize: 10});
    this.phone = new PhoneAccess();
    this.reports = {};
    this.selected_slug = "";
  }

  _.extend(UserInterface.prototype, Backbone.Events);

  UserInterface.prototype.init = function() {
    this.setHeaderAndFooter();
  };

  UserInterface.prototype.setListPage = function() {
    var that = this;
    this.api.on("more", function(reports) {
      that.createReportList(reports);
    });

    this.api.on("reset", function(reports) {
      $(that.listCointainer).empty();
      that.api.more();
    });

    this.api.more();
  };

  UserInterface.prototype.setCreatePage = function() {
    $( ":jqmData(role='actionsheet')").actionsheet();
    $("#create-report").click(function(e) {
      e.preventDefault();
      $("#create-report-sheet-button").trigger("click");
      return false;
    });
  };

  UserInterface.prototype.capturePhoto = function() {
    var that = this;
    //click caputre photo
    $("#capture-photo").click(function(e) {
      e.preventDefault();
      that.phone.capturePhoto();
      return false;
    });
    $("#capture-video").click(function(e) {
      e.preventDefault();
      that.phone.captureVideo();
      return false;
    });
    $("#select-photo").click(function(e) {
      e.preventDefault();
      alert("muaaa");
      that.phone.selectPhoto();
      return false;
    });
    $("#select-video").click(function(e) {
      e.preventDefault();
      that.phone.selectVideo();
      return false;
    });
    //capture success
    this.phone.on("captureSuccess", function(imageURI) {
      that.phone.fileSize(imageURI);
      //modal clicks
      $("#select-upload").unbind("click");
      $("#select-upload").click(function(e) {
        $("#cancel-upload").trigger("click");
        $.mobile.changePage('#formPage');
        that.api.uploadFile(imageURI);
      });
    });

    this.phone.on("fileSizeSuccess", function(size) {
      var conexion = that.phone.getConection();
      var text = "tiene una " + conexion + ". ¿Desea subir el archivo de " + size + "Mb?";
      $("#check-upload-size").text(text);
      $("#check-upload-sheet-button").trigger("click");
    });

    this.api.on("uploadPercent", function(percent) {
      console.log("percent");
    });

    this.api.on("uploadFail", function() {
      alert("Hubo un error al cargar el archivo, intent luego");
      $.mobile.changePage('#createReport');
    });
  };

  UserInterface.prototype._createListItem_ = function(report) {
    var html = "";
    var title = report.titulo;
    var slug = report.slug;
    var descripcion = report.descripcion;
    var thumbnail = report.thumbnail_pequeno;
    var fecha = '' + report.fecha.getDate() + '/' + (report.fecha.getMonth() + 1) +  '/' + report.fecha.getFullYear();
    html = "<tr class='report-item' data-slug='"+slug+"'>" +
      "<td class='image-cell'><img src='" + thumbnail + "' /></td>"+
      "<td class='data-cell'><span class='title'>"+ fecha + " (" + report.tipo + ") <br />" + title +"</span></td>" +
      "</tr>";
    return html;
  };

  UserInterface.prototype.createReportList = function(reports) {
    var i = 0;
    var itemHtml = "";
    $(this.moreButton).remove();

    for(i=0; i<reports.length; i++) {
      var report = reports[i];
      itemHtml = this._createListItem_(report);
      $(this.listCointainer).append($(itemHtml));
      this.reports[report.slug] = report;
    }

    $(this.listCointainer).append($("<tr id='more'>" +
        "<td colspan='2'>Ver Más</td></tr>"));
    var that = this;

    $(".report-item").click(function(e) {
      var slug = $(this).attr("data-slug");
      that.selected_slug = slug;
      $.mobile.changePage('#showReport');
    });

    $(this.moreButton).click(function(e) {
      e.preventDefault();
      that.api.more();
      return false;
    });

  };

  UserInterface.prototype.showReport = function() {
    var report;
    if(!this.selected_slug) {
      $.mobile.changePage('#listPage');
    }
    report = this.reports[this.selected_slug];
    var isVideo = (report['tipo'] == TipoReporte.Video);
    $("#report-title").text(report.titulo);
    $("#report-description").text(report.descripcion);
    if(isVideo) {
      $("#report-media-container").omplayer({
        slug: report.slug,
        width: $("#report-media-container").width(),
        height: 255
      });
    } else {
      $("#report-img").show().attr("src", report.thumbnail_grande);
    }
  };

  UserInterface.prototype.setHeaderAndFooter = function() {

    var HEADER = "<div data-theme='b' data-role='header'>"+
                 "<h1>Soy Reportero</h1>"+
                 "<div class='progressbar-container'>" +
                "<div class='progresstext'>Subiendo Archivo</div>" +
                "<div class='progressbar'></div>" +
                "</div>" +
                 "</div>";
    var FOOTER = "<div data-role='footer' id='navbar-check' data-iconpos='top' data-theme='a'>" +
                 "<ul><li><a href='#createReport' data-transition='fade' data-theme='' data-icon='plus'>" +
                 "<span class='ui-btn-inner'><span class='ui-btn.text'>Enviar reporte</span>" +
                "<span class='ui-icon ui-icon-plus ui-icon-shadow ui-iconsize-18'>&nbsp;</span>"+
                "</span></a></li>" +
                "<li><a href='#listPage' data-transition='none' data-theme='' data-icon='grid'>" +
                "<span class='ui-btn-inner'><span class='ui-btn.text'>Enviar reporte</span>" +
                "<span class='ui-icon ui-icon-grid ui-icon-shadow ui-iconsize-18'>&nbsp;</span>" +
                "</span></a></li></ul><div style='clear: left'></div></div>";


    $("div[data-role='page']").each(function() {
      var id = $(this).attr("id");
      $(this).prepend(HEADER);
      $(this).append(FOOTER);
      $(this).find('div[data-role="header"], div[data-role="footer"]').each(
      function() {
          var dR = $(this).attr('data-role');
          var dT = $(this).attr('data-theme');
          $(this).addClass('ui-' + dR + ' ui-bar-' + dT).attr('role', (dR == 'header' ? 'banner' : 'contentinfo') ).children('h1, h2, h3, h4').each(
              function( ){
                  $(this).addClass('ui-title').attr({'role':'heading', 'aria-level':'1'});
              }
          );
      });

      $(this).trigger('create');
      $("#"+id+" .ui-content").height($(window).height() - $("#"+id+" .ui-footer").height() - $("#"+id+" .ui-header").height()-30);
    });

  };

  UserInterface.prototype.setContetSize = function(id) {
    $("#"+id+" .ui-content").height($(window).height() - $("#"+id+" .ui-footer").height() - $("#"+id+" .ui-header").height()-30);
  };

  return UserInterface;
});

