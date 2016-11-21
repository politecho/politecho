// https://bl.ocks.org/mbostock/01ab2e85e8727d6529d20391c0fd9a16

importScripts("d3.min.js");

onmessage = function (event) {
  var userData = event.data.userData;

  function updateBounds() {
    userData.forEach(function (d) {
      d.x = Math.max(d.r, Math.min(event.data.width - d.r, d.x));
      d.y = Math.max(d.r, Math.min(event.data.height - d.r, d.y));
    });
  }

  var x = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, event.data.width]);

  var simulation = d3.forceSimulation(userData)
    .alphaDecay(0.08)
    .force("x", d3.forceX().x(function (d) {
      return x(d.score);
    }).strength(1))
    .force("y", d3.forceY(event.data.height).strength(1))
    .force("collide", d3.forceCollide(4).iterations(10))
    .stop();

  for (var i = 0, n = 300; i < n; ++i) {
    postMessage({
      type: "tick",
      progress: (i + 1) / n
    });
    simulation.tick();
    updateBounds();
  }

  postMessage({
    type: "end",
    userData: userData
  });
};