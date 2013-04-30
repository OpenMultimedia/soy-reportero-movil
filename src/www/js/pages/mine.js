

function successQueryCB() {
console.log("success reading data from db");
}

function errorQueryCB(e,v) {
console.log("error reading from the db");
}

function querySuccessMine(db, results) {
    console.log(results.rows);
    var len = results.rows.length;
    $("#list-reports-mine").html("");
    for (var i=0; i<len; i++) {
        var item = results.rows.item(i);
        $("#list-reports-mine").prepend("<li data-slug='"+item.slug+"' data-type='"+item.type+"'><span>"+item.title+"</span></li>");
    }
    $("#list-reports-mine").listview("refresh");

 $("#list-reports-mine li").click(function() {
    var type = $(this).attr("data-type");
    var slug = $(this).attr("data-slug");
    var url = "http://multimedia.tlsur.net/api/clip/";
    console.log(slug);
    if(type == "Foto") {
        url = "http://multimedia.tlsur.net/api/imagen/";
    }
    var complete_url = url + slug + "?detalle=normal&tipo=soy-reportero";

    $.getJSON(
        complete_url
      ).
      done(function(e, r) {
        var report;
        if(type == "Foto") {
            report = api.createObjectFromPic_(e);
        } else {
            report = api.createObjectFromClip_(e);
        }
        api.setJustChecked(report.slug, report);
        ui.navTo("#view?"+ type +":" + report.slug);
      }).
      fail(function(e, r) {
        navigator.notification.alert("Su reporte aun no ha sido revisado o ha sido rechazado",function() {
    },"Info","Aceptar");
      });
 });
}

function queryErrorMine() {
navigator.notification.alert("Error al Leer la base de datos", function() {
},"Error","Aceptar");
}

function showReportDB(db) {
db.executeSql('SELECT * FROM MINE', [], querySuccessMine, queryErrorMine);
}

$(document).on('pagechange', function(e, pageOptions) {
    if (pageOptions.toPage.attr("id") == "mine") {
        $('#report-video').hide();
        $('#report-img').hide();
        $("#report-description").text("");
        $("#report-title").text("");
        db = window.openDatabase("soyReporteroDB", "1.0", "Soy reportero", 200000);
        db.transaction(showReportDB, errorQueryCB, successQueryCB);
    }
});
