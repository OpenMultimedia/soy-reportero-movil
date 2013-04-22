function sorted_keys(obj) {
  var keys = [];
  for(var key in obj)
  {
    if(obj.hasOwnProperty(key))
    {
      keys.push(key);
    }
  }
  return keys.sort();
}

function cleanForm() {
  $(".progressbar-container").css("display","none");
  $(".progressbar").css("width", "0%");
  $("#name-input").val("");
  $("#title-input").val("");
  $("#description-input").val("");
  $("#description-input").text("");
  $("#file-id-input").val("");
  $("#send-button").remove();
}

function sing_request(params_dict, key, secret) {
  params_dict['key'] = key;
  cadena = secret;
  var i = 0;
  var sorted_k = sorted_keys(params_dict);
  for(i=0; i<sorted_k.length; i++) {
    var new_key = sorted_k[i];
    cadena += new_key + params_dict[new_key];
  }
  return md5(cadena);
}

function post_report() {
  var data = {'tipo': 'soy-reportero'};
  var name = $("#name-input").val();
  if(name) {
    data['name'] = name;
  }
  var title = $("#title-input").val();
  if(title) {
    data['titulo'] = title;
  }
  var description = $("#description-input").val();
  if(description) {
    data['report'] = description;
  }
  var file_id = $("#file-id-input").val();
  if(file_id) {
    data['archivo'] = file_id;
  }

  var url_post = 'http://multimedia.tlsur.net/api/imagen/';
  if (mediaType == "video") {
    url_post = 'http://multimedia.tlsur.net/api/clip/';
  }
  security_key = 'k4}"-^30C$:3l04$(/<5"7*6|Ie"6x';
  key = 'telesursoyreporteroplonepruebas';
  var signature = sing_request(data, key, security_key);
  data['signature'] = signature;
  $.ajax({
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',

    url: url_post,
    dataType: "json",
    data: data,
    success: function(dato, textStatus, jqXHR){
      var response = JSON.parse(jqXHR['responseText']);
      var slug = response['slug'];
      cleanForm();
      $("#acept-success-button").click(function() {
        $.mobile.changePage("#page1");
      });
      $("#dialogreportsucess").trigger("click");
      $("#send-button").remove();
    },
    error: function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
}

function reloadList() {
  api.reset();
}

function checkReport() {
  if($("#send-button").length) {
    $("#acept-create-button").click(function() {
       cleanForm();
      //$("#check-report").trigger("click");
    });
    $("#edit-create-button").click(function() {
      $.mobile.changePage("#formPage");
      //$("#edit-report").trigger("click");
    });
    $("#dialogexist").trigger("click");
  } else {
      $.mobile.changePage("#createReport");
    //$("#check-report").trigger("click");
  }
}
var api;

var report_list = {};

var selected_slug;

$(document).ready(
    function() {
      //$(".content").height($(window).height() - $(".ui-footer").height() - $(".ui-header").height());

      function onListItemClick() {
        selected_slug = $(this).attr("data-slug");
      }


      function onApiReset() {
        $("#list-reports").empty();
        api.more();
      }

      function onApiMoreLoaded(data) {
        console.log('Data loaded');
        var i = 0;
        var html = "";

        $("#more").remove();

        for(i=0; i< data.length; i++) {
          var report = data[i];
          report_list[report.slug] = report;
          var title = report.titulo;
          var slug = report.slug;
          var descripcion = report.descripcion;
          var thumbnail = report.thumbnail_pequeno;
          var fecha = '' + report.fecha.getDate() + '/' + (report.fecha.getMonth() + 1) +  '/' + report.fecha.getFullYear();

          html = "<li style='height:60px;' class='report-item-li'><a href='#showReport?slug=" + slug + "' class='report-list-item' data-transition='slide' data-slug='"+slug+"'>" +
            "<img style='max-height: 60px;max-width:60px;' src='" + thumbnail + "' /><span class='title'>"+ fecha + " (" + report.tipo + ")<br />" + title +"</span>" +
            "</a></li>";

          $("#list-reports").append(html);
          $(".report-list-item").click(onListItemClick);
        }

        $("#list-reports").append("<li class='report-item-li' id='more'>Ver Más</li> ");

        $("#more").click(function() {
          api.more();
        });

        $("#list-reports").listview("refresh");
      }
 

      $(document).bind('mobileinit', function() {
          console.log('mobileinit');
          var createView = new CreateReporteView({el: $(body), page_id: 'createReport'});
        })

      $(document).bind("mobileinit", function(){
        console.log('aaaa');
      });

      $(document)
      .on('pageinit', function(e, pageOptions) {

          console.log("PageInit", e.target.id);

          //$(".ui-content").css('margin-bottom', $('#footer').height());
          //$("#"+e.target.id+".content").height($(window).height() - $("#"+e.target.id+".ui-footer").height() - $("#"+e.target.id+".ui-header").height());

          alert('a');
          switch (e.target.id) {

            case "listPage":
              api = new ApiStream({pageSize: 10});

              api.on("reset", onApiReset);
              api.on("more", onApiMoreLoaded);

              api.more();

              break;
          }
        }).
        on('pagechange', function(e, pageOptions) {

          //$("#"+pageOptions.toPage[0].id+".content").height($(window).height() - $("#"+pageOptions.toPage[0].id+".ui-footer").height() - $("#"+pageOptions.toPage[0].id+".ui-header").height());

          if (pageOptions.options.fromPage && pageOptions.options.fromPage[0].id == "listPage") {
            //wht to do when one leaves the page
          }

          switch (pageOptions.toPage[0].id) {
            case "createPage":
                alert('a');
                break;
            case "listPage":
              break;
            case "showReport":
              if (!selected_slug) {
                $.mobile.changePage('#listPage');
                return;
              }
              var report = api.fromCache(selected_slug);
              var isVideo = (report['tipo'] == TipoReporte.Video);

              $("#report-img").hide();

              $("#report-description").text(report.descripcion);
              if(isVideo) {
                console.log(report.slug);

                // $("#report-media-container").omplayer({
                //   slug: report.slug,
                //   width: $("#report-media-container").width(),
                //   height: 255
                // });

                $("#report-media-container").html(
                  '<a href="' + report.archivo + '"><img width="100%" src="'+ report.thumbnail_grande +'" /></a>'
                );

              } else {
                $("#report-img").show().attr("src", report.thumbnail_grande);
              }
              break;
            //api.more();
          }
        });

      $("#file-id-input").on("change", function() {
        console.log("cambio");
        $("#send-button-container").html('<a data-role="button" id="send-button" data-icon="check">Enviar Reporte</a>');
        $("#send-button-container").trigger("create");
        $("#send-button").on("click", function() {
          post_report();
        });
      });

      $(".report-list-item").on("tap", function() {
        console.log($(this).attr("data-slug"));
        console.log("hee");
      });
    }
  );