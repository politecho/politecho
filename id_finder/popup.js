chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action == "parseResponse") {
		message.innerText += "\n[" + request.source.toString() + "]";
	}
});

function onWindowLoad() {
	console.log("Window load");
	message = document.querySelector('#message');

	chrome.runtime.sendMessage({ action: 'parse', url: 'https://m.facebook.com/search/1662722772/stories-liked' });
}

window.onload = onWindowLoad;