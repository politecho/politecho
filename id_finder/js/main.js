chrome.runtime.onMessage.addListener(function (request, sender) {
	if (request.action == "parseResponse") {
    storeResponse(request.data);
		loadChart(request.data);
	} else if (request.action == "parseProgress") {
    $('.js-progress-text').text('Progress: ' + Math.floor(request.data.elapsed / request.data.total * 100) + '%');
  }
});

function storeResponse(data) {
  chrome.storage.local.set({"data": JSON.stringify(data)});
}

function getStoredResponse(done) {
  chrome.storage.local.get("data", function(items) {
    return done(JSON.parse(items["data"]));
  });
}

$(document).ready(function() {
  $('.pt-page-1 .button').click(function () {
    PageTransitions.nextPage();
    if (window.location.hash == '#test') {
      var userIds = [];
      for (var i = 0; i < 200; i++) {
          userIds.push(Math.floor(Math.random() * 1000000));
      }

      var userData = userIds.map(function (id) {
          var data = {
              userId: id,
              score: 2 * Math.random() * Math.random() - 1,
              confidence: Math.random(),
          };
          data.frequency = Math.random() < 0.3 ? Math.floor(Math.random() * 10 * (1.5 - Math.abs(data.score - 0.3))) : 0;
          return data;
      });
      
      setTimeout(function () {
        loadChart(userData);
      }, 700);
    } else {
      // chrome.storage.local.clear();
      if (window.location.hash == '#cache') {
        getStoredResponse(function(userData) {
          if (userData) {
            setTimeout(function () {
              loadChart(userData);
            }, 700);
          }
          else {
            chrome.runtime.sendMessage({ action: 'parse' });
          }
        });
      }
      else {
        chrome.runtime.sendMessage({ action: 'parse' });
      }
    }
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
