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

function sing_request(params_dict, key, secret) {
  params_dict['key'] = key;
  cadena = secret;
  var i = 0;
  var sorted_k = sorted_keys(params_dict);
  for (i = 0; i < sorted_k.length; i++) {
    var new_key = sorted_k[i];
    cadena += new_key + params_dict[new_key];
  }
  return md5(cadena);
}

function post_report() {
  var data = {'tipo': 'soy-reportero'};
  var name = $("#name-input").val();
  if(name) {
    data['titulo'] = name;
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
          $.mobile.changePage("#main");
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

$(document).on('create', '#form', function(e, pageOptions) {
  $('#send-button').on('click', function(e) {
    post_report();
  });
});

$(document).on('pagebeforeshow', '#form', function(e, pageOptions) {
  $('#progress-retry-button').hide();
  $('#send-button-container').hide();
});
