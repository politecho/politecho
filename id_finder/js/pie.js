function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

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

  var friendsStdDev = standardDeviation(userData.map(function (u) { return u.score; }));
  var newsFeedStdDev = standardDeviation(userData.reduce(function (a, u) {
    for (var i = 0; i < u.frequency; i++) {
      a.push(u.score);
    }
    return a;
  }, []));
  console.log(friendsStdDev, newsFeedStdDev);

  var width = 200,
      height = 300,
      radius = Math.min(width, height) / 2;

  var arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 50);

  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });

      function makeSVG(data, label, index) {
        var svgParent = d3.select(".pt-page-3").append("svg")
          .attr("class", label)
            .attr("width", width)
            .attr("height", height)
            .style('opacity', 0)
            .style('margin-left', '-10px');
        
        var svg = svgParent
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

          svgParent
            .transition()
            .delay(300 * index)
            .duration(800)
            .style('opacity', 1)
            .style('margin-left', '0px');
      }

      makeSVG(dataNewsfeed, "newsfeed", 1);
      makeSVG(dataFriends, "friends", 0);
  
};