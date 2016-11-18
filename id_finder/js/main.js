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
});
