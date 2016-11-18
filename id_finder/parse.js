function parseDOM(document_root) {
	var share_buttons = document_root.getElementsByClassName('_15kr _5a-2');
	var ids = [];
	
	for (var i = 0; i < share_buttons.length; i++) {
		ids.push(JSON.parse(share_buttons[i].getAttribute('data-store')).share_id);
	}
	return ids.toString();
}
function parsePage(url) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState ==4){
			var ids = [];
			var regexp = /_15kr _5a-2/g;
			var match;
			
			//var text = xhr.responseText.replace(/&quot;/g, '\"');
			
			var text = unescape(xhr.responseText);
			text = text.replace(/&quot;/g, '\"');
			text = text.replace(/&#123;/g, '{');
			text = text.replace(/&#125;/g, '}');
			
			while ((match = regexp.exec(text)) != null) {
				var start = match.index + text.substring(match.index).indexOf("{");
				var end = start + text.substring(start).indexOf("}") + 1;
				ids.push(JSON.parse(text.slice(start,end)).share_id);
			}
			if (ids.length > 0) {
				chrome.runtime.sendMessage({
						action: "parse",
						source: ids
				});
			};
		}
	}
	xhr.send();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("Incoming message", request, sender);
	if (request.action == "parse") {
		parsePage('https://m.facebook.com/search/5281959998/stories-by/1662722772/stories-liked/intersect?__mref=message_bubble');
	}
});
