var lastRequestTime = 0;
var requestInterval = 50;

var timeoutHistory = [];
var xhrHistory = [];

function get(url, done) {
	var xhr = new XMLHttpRequest();
	xhrHistory.push(xhr);
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function (e) {
		if (xhr.readyState == 4) {
			done(xhr.responseText);
		}
	}
	var delay = Math.max(lastRequestTime + requestInterval - (+new Date()), 0) + Math.random() * requestInterval;
	lastRequestTime = delay + (+new Date());
	timeoutHistory.push(setTimeout(function () {
		xhr.send();
	}, delay));
}

function getNewsFeedFrequency(maxDepth, done, onFetch) {
	var frequency = {};

	function fetch(url, depth, fetchDone) {
		console.log('getNewsFeedFrequency.fetch', depth);
		get(url, function (text) {
			var $t = $(text);

			// MARK
			var links = $t.find('[role="article"] a').map(function () {
				return /(.*?)(?:\/\?|\?|$)/.exec($(this).attr('href'))[1];
			}).get();
			links.forEach(function (link) {
				if (!frequency.hasOwnProperty(link)) frequency[link] = 0;
				frequency[link]++;
			});

			onFetch();

			// MARK
			var next = $t.find('a[href^="/stories.php?aftercursorr"]').last().attr('href');
			if (next && depth) {
				fetch('https://mbasic.facebook.com' + next, depth - 1, fetchDone);
			} else {
				fetchDone();
			}
		});
	}

	fetch('https://mbasic.facebook.com/stories.php', maxDepth, function () {
		done(frequency);
	});
}

function getPageLikes(pageId, done, onFetch) {
	console.log('getPageLikes', pageId);
	get('https://mbasic.facebook.com/profile.php?id=' + pageId, function (text) {
		var $t = $(text);
		// MARK
		var url2 = 'https://mbasic.facebook.com' + $t.find('a[href$="about?refid=17"]').attr('href');
		url2 = url2.replace(/about\?refid=17/, 'socialcontext');
		onFetch();

		get(url2, function (text2) {
			var $t = $(text2);
			// MARK
			var profileUrls = $t.find('h4:contains("Friends who like this ")').siblings().find('a').map(function () {
				return {
					href: $(this).attr('href'),
					name: $(this).text(),
				};
			}).get();
			onFetch();
			done(profileUrls);
		});
	});
}

function getAllFriendScores2(done, progress) {
	var maxNewsFeedDepth = 20;

	var pageIds = getAllPageIds();
	var profileToPages = {};
	var profileToName = {};
	var profileToFrequency;
	pageIds.forEach(function (pageId) {
		getPageLikes(pageId, function (profiles) {
			profiles.forEach(function (profile) {
				if (!profileToPages.hasOwnProperty(profile.href)) profileToPages[profile.href] = [];
				profileToPages[profile.href].push(pageId);

				if (!profileToName.hasOwnProperty(profile.href)) profileToName[profile.href] = profile.name;
			});
			onReturn();
		}, onProgress);
	});
	getNewsFeedFrequency(maxNewsFeedDepth, function (data, progress) {
		profileToFrequency = data;
		onReturn();
	}, onProgress);

	var totalProgress = maxNewsFeedDepth + 2 * pageIds.length;
	var elapsedProgress = 0;

	function onProgress() {
		elapsedProgress++;
		progress && progress(elapsedProgress, totalProgress);
	}

	var numReturnsRemaining = 1 + pageIds.length;

	function onReturn() {
		numReturnsRemaining--;
		if (numReturnsRemaining == 0) {
			var results = Object.keys(profileToPages).map(function (profile) {
				var scores = score(profileToPages[profile]);
				return {
					userId: profile,
					name: profileToName[profile],
					frequency: profileToFrequency[profile] || 0,
					score: scores.politicalScore,
					//frequency: scores.frequency, 
					//authenticity: scores.authenticity 
					confidence: scores.confidence,
					pages: scores.pages
				}
			});
			// console.log(Object.keys(profileToFrequency).filter(function (profile) { return !profileToPages.hasOwnProperty(profile); }).join(","));
			done(results);
		}
	}
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

function getLoggedInAs(done) {
	get('https://mbasic.facebook.com', function(text) {
		var $t = $(text);

		// MARK
		var pr = $t.find('a:contains("Profile")');
		if (pr.length === 0) {
			return done(null);
		}
		else {
			var href = pr.attr('href');
			return done(href.substring(0, href.indexOf('?')));
		}
	});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action == "parse") {
		var userData = request.cached;
		getLoggedInAs(function(login) {
			if (!login) {
				// not logged in
				chrome.runtime.sendMessage({
					action: "parseResponse",
					data: [],
					login: null,
					tab: sender.tab.id
				});
			}
			else if (userData && userData["login"] && userData["time"] &&
					login == userData["login"] &&
					(new Date - new Date(parseInt(userData["time"]))) / 1000 / 60 < 30) {
				// cached data is valid
				chrome.runtime.sendMessage({
					action: "parseResponse",
					data: userData["data"],
					login: userData["login"],
					tab: sender.tab.id
				});
			}
			else {
				// cached data is invalid
				getAllFriendScores2(function (data) {
					console.log(data);
					chrome.runtime.sendMessage({
						action: "parseResponse",
						data: data,
						login: login,
						tab: sender.tab.id
					});
				}, function (elapsed, total) {
					console.log('Progress: ' + elapsed + '/' + total);
					chrome.runtime.sendMessage({
						action: "parseProgress",
						data: {
							elapsed: elapsed,
							total: total,
						},
					});
				});
			}
		});
	} else if (request.action == 'reset') {
		timeoutHistory.forEach(function (timeout) {
			clearTimeout(timeout)
		});
		timeoutHistory = [];
		
		xhrHistory.forEach(function (xhr) {
			// http://stackoverflow.com/a/28257394/133211
			xhr.onreadystatechange = null;
			xhr.abort();
		});
		xhrHistory = [];
	}
});