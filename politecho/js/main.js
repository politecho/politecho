chrome.tabs.getCurrent(function (tab) {
  chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "parseResponse" && request.tab == tab.id) {
      storeResponse(request.data, request.login);
      loadChart(request.data, request.login);
    } else if (request.action == "parseProgress") {
      $('.js-progress-text').text('Progress: ' + Math.floor(request.data.elapsed / request.data.total * 100) + '%');
      $('.js-progress-bar').width(request.data.elapsed / request.data.total * 100 + '%');
    }
  });
});

function storeResponse(data, login) {
  if (jQuery.isEmptyObject(data) || !login) return;
  chrome.storage.local.set({
    "data": JSON.stringify(data),
    "login": login,
    "time": (+new Date).toString()
  });
}

function getStoredResponse(done) {
  chrome.storage.local.get(["data", "time", "login"], function(items) {
    if (!(items["data"] && items["time"] && items["login"])) return done({});
    return done({
      data: JSON.parse(items["data"]),
      time: items["time"],
      login: items["login"]
    });
  });
}

function renderShareImage() {
  return $.get('css/default.css').then(function (css) {
    var elem = document.querySelector('g.main');
    var elemHeight = parseInt(elem.attributes.height.value, 10);

    var svgInner = '';
    svgInner += '<text x="30" y="80" style="font-family: \'Playfair Display\'; font-size: 40px">My political bubble</text>';
    svgInner += '<text x="30" y="115" style="font-family: \'Karla\'; font-size: 18px">Made from my friends list using PolitEcho.org</text>';
    svgInner += `<g transform="translate(0, ${630 - elemHeight})">${elem.innerHTML}</g>`;
    svgInner += `<g transform="translate(960, 0)">${document.querySelector('svg.friends').innerHTML}</g>`;
    svgInner += `<g transform="translate(960, 300)">${document.querySelector('svg.newsfeed').innerHTML}</g>`;

    var svg = '<svg><style>' + css + '</style>' + svgInner + '</svg>';

    var canvasOutput = document.createElement('canvas');
    canvasOutput.width = 1200;
    canvasOutput.height = 630;
    canvg(canvasOutput, svg);
    
    return Promise.resolve(canvasOutput);
  });
}

// based on https://github.com/eirikb/gifie/blob/gh-pages/app.js
function uploadCanvas(canvas) {
  return $.ajax({
    url: 'https://api.imgur.com/3/image',
    type: 'POST',
    headers: {
      Authorization: 'Client-ID e22a049ccc88194',
      Accept: 'application/json'
    },
    data: {
      image: canvas.toDataURL('image/png').replace('data:image/png;base64,', ''),
      type: 'base64'
    },
  }).then(function (result) {
    var id = result.data.id;
    return Promise.resolve(`https://i.imgur.com/${id}.png`);
  });
}

// http://stackoverflow.com/a/32261263/133211
function popupwindow(url, title, w, h) {
  var y = window.top.outerHeight / 2 + window.top.screenY - (h / 2)
  var x = window.top.outerWidth / 2 + window.top.screenX - (w / 2)
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
}

function showShareDialog(url) {
  var popupURL = 'https://www.facebook.com/v2.8/dialog/feed?app_id=1825343064416855&display=popup&e2e=%7B%7D&locale=en_US';
  // https://developers.facebook.com/docs/sharing/reference/feed-dialog
  var params = {
    name: 'My political bubble',
    link: 'http://politecho.org',
    description: 'View your news feed\'s political bias with PolitEcho',
    picture: url,
  };
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      popupURL += `&${param}=${encodeURIComponent(params[param])}`;
    }
  }
  popupwindow(popupURL, 'Share on Facebook', 555, 665);
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
      getStoredResponse(function(userData) {
        chrome.runtime.sendMessage({
          action: 'parse',
          cached: userData
        });
      });
    }
  });

  $('.pt-page-4').click(function () {
    PageTransitions.nextPage();
  });

  var currentlySharing = false;
  $('.js-share-fb').click(function (e) {
    e.preventDefault();

    if (currentlySharing) return;
    currentlySharing = true;

    var $progress = $('.js-share-fb-progress');
    $progress.addClass('js-share-fb-progress--animate');
    $progress.text('Rendering');
    renderShareImage().then(function (canvas) {
      $progress.text('Saving');
      return uploadCanvas(canvas);
    }).then(function (url) {
      $progress.text('Sharing');
      setTimeout(function () {
        $progress.removeClass('js-share-fb-progress--animate');
        $progress.text('');
        currentlySharing = false;
      }, 1000);
      return showShareDialog(url);
    }).catch(function () {
      $progress.removeClass('js-share-fb-progress--animate');
      $progress.text('Something went wrong. Please try again.');
      currentlySharing = false;
    });
  });
});
