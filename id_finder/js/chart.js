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
        })])
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

    $('.pt-page-3 .button').click(function () {
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
                return d.frequency > 0;
            });

        var simulation = d3.forceSimulation(userData)
            .alphaDecay(0.08)
            .force("x", d3.forceX().x(function (d) {
                return x(d.score);
            }).strength(1))
            .force("y", d3.forceY().y(function (d) {
                return y(d.frequency);
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
        $('.pt-page-3 h1').text('Political leanings of your news feed');
        $('.pt-page-3 p').first().text("And here's the political sentiment of just your news feed.");
        return false;
    })

    var chart = d3.select('.pt-page-3')
        .append('svg:svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart')

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
        });

    function updateBounds() {
        userData.forEach(function (d) {
            d.x = Math.max(d.r, Math.min(width - d.r, d.x));
            d.y = Math.max(d.r, Math.min(height - d.r, d.y));
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
                break;
            case 'end':
                for (var i = 0; i < userData.length; i++) {
                    Object.assign(userData[i], e.data.userData[i]);
                }
                ticked();
                PageTransitions.nextPage();
                break;
        }
    }
}