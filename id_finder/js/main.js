chrome.runtime.onMessage.addListener(function (request, sender) {
	if (request.action == "parseResponse") {
		loadChart(request.data);
    PageTransitions.nextPage();
	} else if (request.action == "parseProgress") {
    $('.js-progress-text').text('Progress: ' + Math.floor(request.data.elapsed / request.data.total * 100) + '%');
  }
});

$(document).ready(function() {
  $('.pt-page-1').click(function () {
    chrome.runtime.sendMessage({ action: 'parse' });
    PageTransitions.nextPage();
  });

  $('.pt-page-4').click(function () {
    PageTransitions.nextPage();
  });

  var w     = 200;
  var h     = 200;
  var x     = (w/2);
  var y     = (h/2);
  var t0    = new Date().setHours(0,0,0,0);
  var delta = (Date.now() - t0);
  var r = 5;
  var R = 50;

  var svg = d3.select('#load-spinner')
          .attr("width", w)
          .attr("height", h);

  // planet group
  var container = svg.append("g")
    .attr("id", "orbit_container")
    .attr("transform", "translate(" + x + "," + y + ")");

  var colorRamp = d3.scaleLinear().domain([0, 300]).range(["blue", "red"]);
  var planets = [0, 60, 120, 180, 240, 300]

  // draw planets and moon clusters
    container.selectAll("g.planet").data(planets).enter().append("g")
             .attr("class", "planet_cluster").each(function(d, i) {
               d3.select(this).append("circle").attr("r", r).attr("cx",R)
                 .attr("cy", 0).attr("class", "planet").attr("fill", function(d) {
                    return colorRamp((d - 1) % 180 + 1);
                 });
             })
             .attr("transform", function(d) {
               return "rotate(" + d + ")";
             });

             //animations
      setInterval(function(){
        var delta = (Date.now() - t0);
        svg.selectAll(".planet_cluster").attr("transform", function(d) {
          return "rotate(" + (d + delta / 100) + ")";
        }).each(function(d, i) {
          d3.select(this).select("circle").attr("cx", function(d) {
            return R - R/2 * Math.sin(delta / 500);
          }).attr("r", function(d) {
            return r + r / 2 * Math.sin(delta / 500);
          });
        })
      }, 40);

});
