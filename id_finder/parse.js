function parseDOM(document_root) {
	var share_buttons = document_root.getElementsByClassName('_15kr _5a-2');
	var ids = [];

	for (var i = 0; i < share_buttons.length; i++) {
		ids.push(JSON.parse(share_buttons[i].getAttribute('data-store')).share_id);
	}
	return ids.toString();
}

function getFriends(done) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://www.facebook.com', true);
	xhr.onreadystatechange = function (e) {
		if (xhr.readyState == 4) {
			var text = xhr.responseText;
			var ids = JSON.parse(/,list:(\[.*?\])/.exec(text)[1]);
			ids = ids.map(function (e) {
				return /(\d+)-/.exec(e)[1]
			});
			var uniqueIds = ids.filter(function (item, pos) {
				return ids.indexOf(item) == pos;
			})
			done(uniqueIds);
		}
	}
	xhr.send();
}

var lastRequestTime = 0;
var requestInterval = 500;

function parsePage(url, done) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function (e) {
		if (xhr.readyState == 4) {
			var text = xhr.responseText;
			var $t = $(text);
			var result = $t.find('code').toArray().map(function (e) {
				return e.innerHTML
			}).filter(function (e) {
				return e.indexOf('id="BrowseResultsContainer"') != -1
			})[0];

			if (!result) {
				// console.log('empty result:', url);
				done([]);
			} else {
				var $q = $(result.slice(5, -4));
				var ids = $q.find('[data-hovercard]').map(function (e) {
					return /id=([\d]+)/.exec($(this).attr('data-hovercard'))[1]
				}).get();
				console.log('results:', ids);
				done(ids);
			}

			// debugger;
			// $(text).find('strong a').each(function () {
			// 	console.log($(this).attr('href'));
			// });

			// var seeMore = $(text).find('#see_more_pager a').attr('href');
			// debugger;
			// if (seeMore) {
			// 	console.log(seeMore);
			// 	parsePage(seeMore, done);
			// }

			// var ids = [];
			// var regexp = /_15kr _5a-2/g;
			// var match;

			// //var text = xhr.responseText.replace(/&quot;/g, '\"');

			// var text = unescape(xhr.responseText);
			// text = text.replace(/&quot;/g, '\"');
			// text = text.replace(/&#123;/g, '{');
			// text = text.replace(/&#125;/g, '}');

			// while ((match = regexp.exec(text)) != null) {
			// 	var start = match.index + text.substring(match.index).indexOf("{");
			// 	var end = start + text.substring(start).indexOf("}") + 1;
			// 	ids.push(JSON.parse(text.slice(start,end)).share_id);
			// }
			// if (ids.length > 0) {
			// 	chrome.runtime.sendMessage({
			// 		action: "parseResponse",
			// 		source: ids
			// 	});
			// }
		}
	}
	var delay = Math.max(lastRequestTime + requestInterval - (+new Date()), 0);
	lastRequestTime = delay + (+new Date());
	setTimeout(function () {
		xhr.send();
	}, delay);
}

function buildQueryUrl(userId, newsSourceIds) {
	var url = 'https://www.facebook.com/search';
	for (var i = 0; i < newsSourceIds.length; i++) {
		url += '/' + newsSourceIds[i] + '/stories-by';
		if (i > 0) {
			url += '/union/intersect';
		}
	}
	url += '/' + userId + '/stories-liked/intersect';
	return url;
}

function getAllPageIds() {
	return Object.keys(news_dict)
		.concat(Object.keys(fakenews_dict))
		.concat(Object.keys(pol_dict));
}

function getUserScore(userId, done) {
	var pageIds = getAllPageIds();
	var urls = [];
	while (pageIds.length > 0) {
		var url = buildQueryUrl(userId, pageIds.splice(0, 5));
		urls.push(url);
	}
	var returnedCount = 0;
	var foundPageIds = [];
	urls.forEach(function (url) {
		parsePage(url, function (thisIds) {
			foundPageIds.push.apply(foundPageIds, thisIds);
			returnedCount++;
			if (returnedCount == urls.length) {
				done(score(foundPageIds));
			}
		});
	});
}

function getAllFriendScores(done) {
	getFriends(function (userIds) {
		// TODO: remove limit
		userIds = userIds.splice(0, 10);

		var results = [];
		userIds.forEach(function (userId) {
			getUserScore(userId, function (score) {
				results.push({
					userId: userId,
					score: score,
				});
				if (results.length == userIds.length) {
					done(results);
				}
			});
		});
	});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("Incoming message", request, sender);
	if (request.action == "parse") {
		// parsePage(buildQueryUrl(request.userId, request.newsSourceIds));
		// getFriends();
		getAllFriendScores(function (results) {
			console.log(results);
		});
		sendResponse('a');
	}
});