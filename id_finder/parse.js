function parseDOM(document_root) {
	var share_buttons = document_root.getElementsByClassName('_15kr _5a-2');
	var ids = [];
	
	for (var i = 0; i < share_buttons.length; i++) {
		ids.push(JSON.parse(share_buttons[i].getAttribute('data-store')).share_id);
	}
	return ids.toString();
}
function parsePage(url, done) {
	console.log(url);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState ==4){
			var text = xhr.responseText;
			var $t = $(text);
			var $q = $($t.find('code').toArray().map(function (e) {return e.innerHTML}).filter(function(e) { return e.indexOf('id="BrowseResultsContainer"') != -1 })[0].slice(5, -4));
			var ids = $q.find('[data-hovercard]').map(function (e) {return /id=([\d]+)/.exec($(this).attr('data-hovercard'))[1]}).get();
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
			if (ids.length > 0) {
				chrome.runtime.sendMessage({
						action: "parseResponse",
						source: ids
				});
			}
		}
	}
	xhr.send();
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("Incoming message", request, sender);
	if (request.action == "parse") {
		parsePage(buildQueryUrl(request.userId, request.newsSourceIds));
		sendResponse('a');
	}
});
