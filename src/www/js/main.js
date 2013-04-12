function getReports(offset, batchSize, callback) {
	$.getJSON('http://multimedia.tlsur.net/api/clip/?ultimo=10&tipo=soy-reportero&autenticado=w3bt3l3sUrTV',
    function(data) {
		$.each(data, function(key, val) {
    		console.log(key);
  		});
  		callback(data);
	 });
	//console.log(videos.fetch({ dataType: 'jsonp' }));
}


console.log("no");
$(document).ready(
		function() {
			console.log("your sister");
			var report_list = {};
			var selected_slug;
			$( 'div' ).on( 'pagehide',function(event, ui) {
				if( ui.nextPage[0].id === "listPage") {
					console.log("esta");
					getReports(0, 4, function(data) {
						var i = 0;
						var html = "";
						for(i=0; i< data.length; i++) {
							var report = data[i];
							report_list[report.slug] = report;
							var title = report.titulo;
							var slug = report.slug;
							var descripcion = report.descripcion;
							var thumbnail = report.thumbnail_pequeno;
							html += "<li class='report-item-li' ><a href='#showReport' class='report-list-item' data-transition='slide' data-slug='"+slug+"'><img src='" + thumbnail + "' /><span class='title'>"+ title +"</span></a></li>";
							$("#list-reports").html(html);
							$(".report-list-item").click(function() {
								selected_slug = $(this).attr("data-slug");
							});
						}
					});
				}
				else if(ui.nextPage[0].id === "showReport") {
					var isVideo = true;
					var report = report_list[selected_slug];
					$("#report-description").text(report.descripcion);
					if(isVideo) {
						console.log(report.slug);
						$("#report-media-container").omplayer({
							slug: report.slug,
							width: $("#report-media-container").width(),
							height: 255
						});
					} else {
						$("#report-img").attr("src", report.thumbnail_grande);
					}
				}
			});

			$(".report-list-item").on("tap", function() {
				console.log($(this).attr("data-slug"));
				console.log("hee");

			});
		}
	);