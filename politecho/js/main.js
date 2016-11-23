chrome.tabs.getCurrent(function (tab) {
  chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "parseResponse" && request.tab == tab.id) {
      storeResponse(request.data);
      loadChart(request.data);
    } else if (request.action == "parseProgress") {
      $('.js-progress-text').text('Progress: ' + Math.floor(request.data.elapsed / request.data.total * 100) + '%');
      $('.js-progress-bar').width(request.data.elapsed / request.data.total * 100 + '%');
    }
  });
});

function storeResponse(data) {
  chrome.storage.local.set({"data": JSON.stringify(data)});
}

function getStoredResponse(done) {
  chrome.storage.local.get("data", function(items) {
    return done(JSON.parse(items["data"]));
  });
}

function renderShareImage(done) {
  $.get('css/default.css', function (css) {
    var elem = document.querySelector('g.main');
    var elemHeight = parseInt(elem.attributes.height.value, 10);

    var svgInner = '';
    svgInner += '<text x="30" y="80" style="font-family: \'Playfair Display\'; font-size: 40px">My political bubble</text>';
    svgInner += '<text x="30" y="115" style="font-family: \'Playfair Display\'; font-size: 18px">Made with PolitEcho.org</text>';
    svgInner += `<g transform="translate(0, ${630 - elemHeight})">${elem.innerHTML}</g>`;
    svgInner += `<g transform="translate(810, 0), scale(0.8)">${document.querySelector('svg.friends').innerHTML}</g>`;
    svgInner += `<g transform="translate(1000, 0), scale(0.8)">${document.querySelector('svg.newsfeed').innerHTML}</g>`;

    var svg = '<svg><style>' + css + '</style>' + svgInner + '</svg>';

    var canvasOutput = document.createElement('canvas');
    canvasOutput.width = 1200;
    canvasOutput.height = 630;
    canvg(canvasOutput, svg);
    
    done(canvasOutput);
  });
}

// based on https://github.com/eirikb/gifie/blob/gh-pages/app.js
function uploadCanvas(canvas, done) {
  $.ajax({
    url: 'https://api.imgur.com/3/image',
    type: 'POST',
    headers: {
      Authorization: 'Client-ID e22a049ccc88194',
      Accept: 'application/json'
    },
    data: {
      image: canvas.toDataURL(),
      type: 'base64'
    },
    success: function (result) {
      var id = result.data.id;
      done(`https://i.imgur.com/${id}.png`)
    },
  });
}

$(document).ready(function() {
  chrome.runtime.sendMessage({ action: 'reset' });

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

  $('.js-share-fb').click(function (e) {
    e.preventDefault();
    renderShareImage(function (canvas) {
      uploadCanvas(canvas, function (url) {
        window.open(url, '_blank');
      });
    });
  });
});
