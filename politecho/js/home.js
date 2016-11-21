(function homeAnim() {
  var w     = 2400;
  var h     = 200;
  var x     = (w/2);
  var y     = (h/2);
  var t0    = new Date().setHours(0,0,0,0);
  var delta = (Date.now() - t0);
  var r = 10;
  var R = 50;  

  var svg = d3.select('#home-animation')
          .attr("width", w)
          .attr("height", h);

  // planet group
  var container = svg.append("g")
    .attr("id", "orbit_container")
    .attr("transform", "translate(" + x + "," + y + ")");

  var colorRamp = d3.scaleLinear().domain([0, 1800]).range(["red", "blue"]);
  var planets = []
  for (var i = 0; i <= 1800; i += 60) {
    planets.push(i);
  }

  // draw planets and moon clusters
    container.selectAll("g.planet").data(planets).enter().append("g")
             .attr("class", "planet_cluster").each(function(d, i) {
               d3.select(this).append("circle").attr("r", r).attr("cx", i * R - 1200)
                 .attr("cy", 0).attr("class", "planet").attr("fill", function(d) {
                    return colorRamp(d);
                 }).attr("opacity", 0.1);
             });

             //animations
      window.loadingAnimInterval = setInterval(function(){
        var delta = (Date.now() - t0);
        svg.selectAll(".planet_cluster circle").attr("cy", function(d) {
          return 50 * Math.sin(d + delta / 3000);
        });
      }, 40);
})();