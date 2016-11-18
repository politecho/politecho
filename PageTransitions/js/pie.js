(function pies() {
  var colorRamp = d3.scaleLinear().domain([-1, 1]).range(["blue", "red"]);

  var dataFriends = [
  { lean: -1, count: 10},
  { lean: -0.5, count: 20},
  { lean: 0, count: 5},
  { lean: 0.5, count: 2},
  { lean: 1, count: 3}
      ];

  var dataNewsfeed = [
  { lean: -1, count: 7},
  { lean: -0.5, count: 25},
  { lean: 0, count: 5},
  { lean: 0.5, count: 2},
  { lean: 1, count: 1}
      ];

  var width = 400,
      height = 400,
      radius = Math.min(width, height) / 2;

  var arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);

  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });

      function makeSVG(data) {
        var svg = d3.select(".pt-page-4").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

          var g = svg.selectAll(".arc")
              .data(pie(data))
            .enter().append("g")
              .attr("class", "arc");

          g.append("path")
              .attr("d", arc)
              .style("fill", function(d) { return colorRamp(d.data.lean); });
      }

      makeSVG(dataFriends);
      makeSVG(dataNewsfeed);
  
})();