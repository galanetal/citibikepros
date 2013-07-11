//<![CDATA[

	var opts_radar = {
					
		
		//Boolean - If we want to override with a hard coded scale
		scaleOverride : false,
		
		//** Required if scaleOverride is true **
		//Number - The number of steps in a hard coded scale
		scaleSteps : 4,//null,
		//Number - The value jump in the hard coded scale
		scaleStepWidth : 70,//null,
		//Number - The centre starting value
		scaleStartValue : 5,//null,
		
		//Boolean - Whether to show lines for each scale point
		scaleShowLine : true,

		//String - Colour of the scale line	
		scaleLineColor : "rgba(0,0,0,.1)",
		
		//Number - Pixel width of the scale line	
		scaleLineWidth : 1,

		//Boolean - If we show the scale above the chart data			
		scaleOverlay : !false,
		//Boolean - Whether to show labels on the scale	
		scaleShowLabels : !false,
		
		//Interpolated JS string - can access value
		scaleLabel : "<%=value%>",
		
		//String - Scale label font declaration for the scale label
		scaleFontFamily : "'Arial'",
		
		//Number - Scale label font size in pixels	
		scaleFontSize : 12,
		
		//String - Scale label font weight style	
		scaleFontStyle : "normal",
		
		//String - Scale label font colour	
		scaleFontColor : "#666",
		
		//Boolean - Show a backdrop to the scale label
		scaleShowLabelBackdrop : true,
		
		//String - The colour of the label backdrop	
		scaleBackdropColor : "rgba(255,255,255,0.75)",
		
		//Number - The backdrop padding above & below the label in pixels
		scaleBackdropPaddingY : 2,
		
		//Number - The backdrop padding to the side of the label in pixels	
		scaleBackdropPaddingX : 2,
		
		//Boolean - Whether we show the angle lines out of the radar
		angleShowLineOut : true,
		
		//String - Colour of the angle line
		angleLineColor : "rgba(0,0,0,.1)",
		
		//Number - Pixel width of the angle line
		angleLineWidth : 1,			
		
		//String - Point label font declaration
		pointLabelFontFamily : "'Arial'",
		
		//String - Point label font weight
		pointLabelFontStyle : "normal",
		
		//Number - Point label font size in pixels	
		pointLabelFontSize : 12,
		
		//String - Point label font colour	
		pointLabelFontColor : "#666",
		
		//Boolean - Whether to show a dot for each point
		pointDot : true,
		
		//Number - Radius of each point dot in pixels
		pointDotRadius : 3,
		
		//Number - Pixel width of point dot stroke
		pointDotStrokeWidth : 1,
		
		//Boolean - Whether to show a stroke for datasets
		datasetStroke : true,
		
		//Number - Pixel width of dataset stroke
		datasetStrokeWidth : 2,
		
		//Boolean - Whether to fill the dataset with a colour
		datasetFill : true,
		
		//Boolean - Whether to animate the chart
		animation : true,

		//Number - Number of animation steps
		animationSteps : 60,
		
		//String - Animation easing effect
		animationEasing : "easeOutQuart",

		//Function - Fires when the animation is complete
		onAnimationComplete : null
		
	};


/**
 * Sample application that uses the foursquare API to show how many Starbucks
 * locations a user has been to.
 */
function HowMany(apiKey, authUrl, apiUrl) {
  this.foursquare = new Foursquare(apiKey, authUrl, apiUrl);
}

/**
 * Fetch users's history, and then render in callbkac.
 */
HowMany.prototype.run = function() {
  this.foursquare.venueHistory({"categoryId":"4e4c9077bd41f78e849722f9"},bind(this.onHistory, this));
}

/**
 * Given response from venuehistory, build a map from venue ID to history item.
 * @private
 */
HowMany.prototype.onHistory = function(history) {

	var palette = [[44, 48, 59], [220, 216, 211], [166, 181, 189], [141, 137, 132], [41, 77, 138], [40, 115, 191], [188, 140, 140]];

	var data = [];
	var data_radar = {};
	var data_radar_adg = {};
  var html = [];
  var count = 0;

  var trend = _.sortBy(history,function(h){ return h.venue.stats.checkinsCount; }).reverse();
  var trend_adg = _.sortBy(history,function(h){ return h.beenHere; }).reverse();

  /*
  for (var i = 0; i < Math.min(palette.length,trend_adg.length); i++) {
    var entry = trend_adg[i]['venue'];
    var name = entry.name;
    var address = entry.location.address;
    var city = entry.location.city;

    var areaColor = "#" + _(palette[i]).rgbToHex(); //console.log(palette[i])

    data.push({color:areaColor,value:history[i].beenHere})


  }
  */
  

  var radar_vals = trend;

  var radar_vals_adg = _.pluck( radar_vals,'beenHere');
  var radar_vals_adg_max = _.max(radar_vals_adg);

 	var radar_labels = _.map(radar_vals, function(t){ if(t.venue.location.address==undefined){ return t.venue.location.lat.toFixed(2) + ", " + t.venue.location.lng.toFixed(2); } return t.venue.location.address; });

  data_radar = {
  			labels: radar_labels,
  			datasets: [
  			{
					fillColor : _({rgb:palette[6],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[6],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[6],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : _.map( radar_vals, function(r){ if(r.venue.stats.checkinsCount>radar_vals_adg_max) { return radar_vals_adg_max; } return r.venue.stats.checkinsCount})
				},
  			{
					fillColor : _({rgb:palette[4],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[4],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[4],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : _.map( radar_vals, function(r){ var avg = r.venue.stats.checkinsCount/r.venue.stats.usersCount; if(avg>radar_vals_adg_max) { return radar_vals_adg_max; } return avg;})
				},
  			{
					fillColor : _({rgb:palette[5],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[5],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[5],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : radar_vals_adg
				}
				]
		};



  var radar_vals = _.first(	trend, 7 );

  var radar_vals_adg = _.pluck( radar_vals,'beenHere');
  var radar_vals_adg_max = _.max(radar_vals_adg);

 	var radar_labels = _.map(radar_vals, function(t){ if(t.venue.location.address==undefined){ return t.venue.location.lat.toFixed(2) + ", " + t.venue.location.lng.toFixed(2); } return t.venue.location.address; });

  data_radar_zoom = {
  			labels: radar_labels,
  			datasets: [
  			{
					fillColor : _({rgb:palette[3],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[3],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[3],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : _.map( radar_vals, function(r){ if(r.venue.stats.checkinsCount>radar_vals_adg_max) { return radar_vals_adg_max; } return r.venue.stats.checkinsCount})
				},
  			{
					fillColor : _({rgb:palette[4],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[4],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[4],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : _.map( radar_vals, function(r){ var avg = r.venue.stats.checkinsCount/r.venue.stats.usersCount; if(avg>radar_vals_adg_max) { return radar_vals_adg_max; } return avg;})
				},
  			{
					fillColor : _({rgb:palette[5],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[5],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[5],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : radar_vals_adg
				}
				]
		};


  var radar_vals = _.first(	trend_adg, 7 );
  var radar_vals_adg = _.pluck( radar_vals,'beenHere');
  var radar_vals_adg_max = _.max(radar_vals_adg);

 	var radar_labels = _.map(radar_vals, function(t){ if(t.venue.location.address==undefined){ return t.venue.location.lat.toFixed(2) + ", " + t.venue.location.lng.toFixed(2); } return t.venue.location.address; });

  data_radar_adg = {
  			labels: radar_labels,
  			datasets: [
  			{
					fillColor : _({rgb:palette[0],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[0],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[0],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : _.map( radar_vals, function(r){ if(r.venue.stats.checkinsCount>radar_vals_adg_max) { return radar_vals_adg_max; } return r.venue.stats.checkinsCount})
				},
  			{
					fillColor : _({rgb:palette[4],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[4],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[4],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : _.map( radar_vals, function(r){ var avg = r.venue.stats.checkinsCount/r.venue.stats.usersCount; if(avg>radar_vals_adg_max) { return radar_vals_adg_max; } return avg;})
				},
  			{
					fillColor : _({rgb:palette[5],a:.5}).rgbToRgba(),
					strokeColor : _({rgb:palette[5],a:1}).rgbToRgba(),
					pointColor : _({rgb:palette[5],a:1}).rgbToRgba(),
					pointStrokeColor : "#fff",
					data : radar_vals_adg
				}
				]
		};


		var citiColor = _({rgb:palette[4],a:1}).rgbToRgba()//"rgb(42, 78, 138)";
		var adgColor = _({rgb:palette[5],a:1}).rgbToRgba()//"rgb(41, 116, 191)";

		var vs1_avg = trend_adg[0].venue.stats.checkinsCount/trend_adg[0].venue.stats.usersCount;
		$('#vs-1-header').html(trend_adg[0].venue.location.address);
		$('#vs-1-stats').append("<li>"+ trend_adg[0].beenHere + " checkins");
		$('#vs-1-stats').append("<li>"+ vs1_avg + " checkins");
    var data_vs1 = [{color:adgColor,value:trend_adg[0].beenHere},{color:citiColor,value:vs1_avg}]

		var vs2_avg = trend_adg[1].venue.stats.checkinsCount/trend_adg[1].venue.stats.usersCount;
		$('#vs-2-header').html(trend_adg[1].venue.location.address);
		$('#vs-2-stats').append("<li>"+ trend_adg[1].beenHere + " checkins");
		$('#vs-2-stats').append("<li>"+ vs2_avg + " checkins");
    var data_vs2 = [{color:adgColor,value:trend_adg[1].beenHere},{color:citiColor,value:vs2_avg}]


	//Get the context of the canvas element we want to select
	var ctx_p = document.getElementById("stations-polar").getContext("2d");

	var ctx_d1 = document.getElementById("vs-1-donut").getContext("2d");
	var ctx_d2 = document.getElementById("vs-2-donut").getContext("2d");

	var ctx_r = document.getElementById("stations-radar").getContext("2d");
	var ctx_rz = document.getElementById("stations-radar-zoom").getContext("2d");
	var ctx_ra = document.getElementById("stations-radar-adg").getContext("2d");

	var donut_v1 = new Chart(ctx_d1).Doughnut(data_vs1);
	var donut_v2 = new Chart(ctx_d2).Doughnut(data_vs2);

	var stations_radar = new Chart(ctx_r).Radar(data_radar,opts_radar);
	var stations_radar_zoom = new Chart(ctx_rz).Radar(data_radar_zoom,opts_radar);
	var stations_radar_adg = new Chart(ctx_ra).Radar(data_radar_adg,opts_radar);

}
//]]>

_.mixin({
  // convert 0..255 R,G,B values to a hexidecimal color string
	rgbToHex: function(rgb){
		 	var r = rgb[0], g = rgb[1], b = rgb[2];
	    var bin = r << 16 | g << 8 | b;
	    return (function(h){
	        return new Array(7-h.length).join("0")+h
	    })(bin.toString(16).toUpperCase());
	},
	rgbToRgba: function(rgb_opts){
			var rgb = rgb_opts.rgb, alpha = rgb_opts.a;
		 	var r = rgb[0], g = rgb[1], b = rgb[2], a = alpha;
		 	var rgba = "rgba(" + r +","+ g + "," + b + "," + a + ")";
		 	return rgba;
	}
});


$(document).ready(function(){
	new HowMany('DL2IV1S3MABQGLX3YO3BLBDTTM3YR0XUBFMRCEJV3NMTP25O', 'https://foursquare.com/', 'https://api.foursquare.com/').run();

  // convert the image to a texture
  
 //  var source_image = document.getElementById('bgcitibike');
 //  var thief = new ColorThief();
	// var palette = thief.getPalette(source_image, 8);
	// console.log(palette)
	


});
