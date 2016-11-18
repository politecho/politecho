function pies(userData) {
  var colorRamp = d3.scaleLinear().domain([-1, 1]).range(["blue", "red"]);

  var dataFriends = [
  { lean: -1, count: 0},
  { lean: -0.5, count: 0},
  { lean: 0, count: 0},
  { lean: 0.5, count: 0},
  { lean: 1, count: 0}
      ];

  var dataNewsfeed = [
  { lean: -1, count: 0},
  { lean: -0.5, count: 0},
  { lean: 0, count: 0},
  { lean: 0.5, count: 0},
  { lean: 1, count: 0}
      ];

  userData.forEach(function (u) {
    var nearestBucket = (Math.round(u.score * 2) / 2).toFixed(1)
    dataFriends.forEach(function (d) {
      if (nearestBucket == d.lean) {
        d.count += 1;
      }
    });
    dataNewsfeed.forEach(function (d) {
      if (nearestBucket == d.lean) {
        d.count += u.frequency;
      }
    });
  });

  var width = 200,
      height = 300,
      radius = Math.min(width, height) / 2;

  var arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 50);

  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });

      function makeSVG(data, label) {
        var svg = d3.select(".pt-page-3").append("svg")
          .attr("class", label)
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

          svg.append("text").text(label)
            .attr("x", -100)
            .attr("y", 110);
      }

      makeSVG(dataNewsfeed, "newsfeed");
      makeSVG(dataFriends, "friends");
  
};