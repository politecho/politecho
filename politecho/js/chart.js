function loadChart(userData) {
    userData.forEach(function (d) {
        d.r = 3;
    });

    var margin = {
            top: 20,
            right: 15,
            bottom: 60,
            left: 60
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .domain([-1, 1])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(userData, function (d) {
            return d.frequency;
        }) + 1])
        .range([height, 0]);

    var y2 = d3.scaleLinear()
        .domain([0, 1])
        .range([height, height / 2]);

    var area = d3.area()
        .x(function (d) {
            return x(d[0]);
        })
        .y0(y2(0))
        .y1(function (d) {
            return y2(d[1]);
        });

    $('.pt-page-3 .button.next').click(function () {
        userData.forEach(function (d) {
            d.r = Math.sqrt(d.frequency) * 3 + 2;
        });

        nodes
            .transition()
            .ease(d3.easeCubicOut)
            .duration(500)
            .attr('r', function (d) {
                return d.r;
            });

        lines
            .transition()
            .ease(d3.easeCubicOut)
            .duration(500)
            .attr('opacity', function (d) {
                return d.frequency > 0 ? d.confidence : 0;
            });

        var simulation = d3.forceSimulation(userData)
            .alphaDecay(0.08)
            .force("x", d3.forceX().x(function (d) {
                return x(d.score);
            }).strength(1))
            .force("y", d3.forceY().y(function (d) {
                return y(d.frequency > 0 ? d.frequency + 1 : 0);
            }))
            .force("collide", d3.forceCollide(function (d) {
                return d.r + 1;
            }).iterations(10))
            .on('tick', ticked);

        var newsFeedItems = [];
        userData.forEach(function (e) {
            for (var i = 0; i < e.frequency; i++) {
                newsFeedItems.push(e);
            }
        });
        main.insert("path", ':first-child')
            .datum(x.ticks(100).map(function (x) { return [x, 0]; }))
            .attr("class", "area2")
            .attr("d", area)
            .attr('opacity', 0)
            .datum(kde(newsFeedItems))
            .transition()
            .ease(d3.easeCubicOut)
            .duration(1000)
            .attr('opacity', 1)
            .attr("d", area);

        $(this).off('click');
        $('.pt-page-3 h1')
            .css({position: 'relative'})
            .animate({opacity: 0, top: '-10px'}, 200, function () {
                $(this).text('Political leanings of your news feed')
            })
            .animate({top: '10px'}, 0)
            .animate({opacity: 1, top: 0}, 200);
        $('.pt-page-3 p').first()
            .delay(50)
            .css({position: 'relative'})
            .animate({opacity: 0, top: '-10px'}, 200, function () {
                $(this).text("The larger bubbles are highlighted here to represent the people who show up most often in your news feed.")
            })
            .animate({top: '10px'}, 0)
            .animate({opacity: 1, top: 0}, 200);
        $(this).click(function() {
            pies(userData);
            $(this).off('click');
            $(this).hide();
            $("p.hifrom")
                .css({position: 'relative', top: '10px', opacity: 0, display: 'block'})
                .animate({opacity: 1, top: 0}, 400);
        });
        $('.pt-page-3 .button.back').show();
        return false;
    });
    $('.pt-page-3 .button.back').hide();
    $('.pt-page-3 .button.back').click(function() {
        console.log("bruh")
    });

    var chart = d3.select('.pt-page-3 .col-xs-8')
        .append('svg:svg')
        .attr('class', 'chart')
        .attr('viewBox', margin.left +' '+margin.bottom+' '+(width - margin.right) + ' ' + (height - margin.top))
        .attr('preserveAspectRatio', 'xMinYMid meet')

    var main = chart.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'main')

    var g = main.append("svg:g");

    var colorRamp = d3.scaleLinear().domain([-1, 1]).range(["blue", "red"]);

    var lines = g.selectAll('line')
        .data(userData)
        .enter().append('line')
        .attr('class', 'node-line')
        .attr('opacity', 0);

    var nodes = g.selectAll("scatter-dots")
        .data(userData)
        .enter().append("svg:circle")
        .attr("r", function (d) {
            return d.r;
        })
        .attr("fill", function (d, i) {
            return colorRamp(d.score);
        })
        .attr('opacity', function (d) {
            return d.confidence;
        })
        .on("click", function(d) {
            chrome.tabs.create({url: "https://www.facebook.com" + d.userId});
            return false;
        })
        .on("mouseover", function(d) {
            $tooltip.html($("<p>").html(d.name + " likes:"));
            var $p = $("<p>");
            d.pages.forEach(function(p) {
                $p.append($("<div>").css("color", tooltipColorRamp(p.score)).text(p.name));
            });
            $tooltip.append($p);
            var confidence = d.confidence > 0.8 ? "High" : d.confidence < 0.3 ? "Low" : "Medium";
            $tooltip.append($("<p>").text("Confidence: "+confidence));
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(){return tooltip.style("top", Math.min(event.pageY-10, $(window).height() - $tooltip.height())+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .style("position", "absolute")
        .style("z-index", "999")
        .style("visibility", "hidden");
    var $tooltip = $(tooltip.node());
    var tooltipColorRamp = d3.scaleLinear().domain([-1, 1]).range(["blue", "red"]);

    function updateBounds() {
        userData.forEach(function (d) {
            d.x = Math.max(d.r, Math.min(width - d.r, d.x));
            d.y = Math.max(d.r, Math.min(height - d.r, d.y));
        });
    }

    function tickedOffset() {
        updateBounds();

        nodes
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y - 50;
            });
    }

    function tickedTransitionReset() {
        nodes
            .transition()
            .duration(600)
            .ease(d3.easeCubicInOut)
            .delay(function (d) {
                return Math.random() * 300;
            })
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
    }

    function ticked() {
        updateBounds();

        nodes
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });

        lines
            .attr('x1', function (d) {
                return d.x;
            })
            .attr('y1', function (d) {
                return y(0);
            })
            .attr('x2', function (d) {
                return d.x;
            })
            .attr('y2', function (d) {
                return d.y;
            });
    }

    var numHistBins = Math.ceil(Math.sqrt(userData.length));
    var bandwith = 1;

    function kernelDensityEstimator(kernel, xs) {
        return function (sample) {
            return xs.map(function (x) {
                return [x, d3.mean(sample, function (v) {
                    return kernel(x - v.score);
                })];
            });
        };
    }

    function epanechnikovKernel(bandwith) {
        return function (u) {
            if (Math.abs(u = u / bandwith) <= 1) {
                return 0.75 * (1 - u * u) / bandwith;
            } else return 0;
        };
    }

    var kde = kernelDensityEstimator(epanechnikovKernel(bandwith), x.ticks(100));

    var worker = new Worker('js/worker.js');
    worker.postMessage({
        userData: userData,
        width: width,
        height: height
    });
    worker.onmessage = function (e) {
        switch (e.data.type) {
            case 'tick':
                $('.js-render-text').text('Rendering: ' + Math.floor(e.data.progress * 100) + '%');
                $('.js-render-bar').width(e.data.progress * 100 + '%');
                break;
            case 'end':
                if (jQuery.isEmptyObject(userData)) {
                    // handle scrape error (TODO better to detect this in parse.js)
                    var $errorDiv = $("<p>");
                    $errorDiv.text("There was an error accessing your news feed data. Please ensure that you are logged in to Facebook on Chrome and that your news feed language is set to English.");
                    $('.pt-page-3 .col-xs-8 p').remove();
                    $('.pt-page-3 .col-xs-8 .button').remove();
                    $('.pt-page-3 .col-xs-8 svg').before($errorDiv);
                }
                for (var i = 0; i < userData.length; i++) {
                    Object.assign(userData[i], e.data.userData[i]);
                }
                tickedOffset();
                window.doneLoading = true; // im sorry
                $('#load-spinner')
                    .delay(800)
                    .animate({opacity: 0}, 300);
                setTimeout(function() {
                    PageTransitions.nextPage();
                    setTimeout(tickedTransitionReset, 100);
                }, 1000);
                break;
        }
    }
}

$(document).ready(function() {

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
      window.loadingAnimInterval = setInterval(function(){
        var delta = (Date.now() - t0);
        svg.selectAll(".planet_cluster").attr("transform", function(d) {
          return "rotate(" + (d + delta / 100) + ")";
        }).each(function(d, i) {
          d3.select(this).select("circle").attr("cx", function(d) {
            if (window.doneLoading) {
                return R + R/2 * Math.abs(Math.sin(delta / 100));
            }
            return R - R/2 * Math.sin(delta / 500);
          }).attr("r", function(d) {
            return r + r / 2 * Math.sin(delta / 500);
          });
        })
      }, 40);
})