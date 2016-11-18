chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action == "parse") {
		message.innerText += "\n[" + request.source.toString() + "]";
	}
});

function onWindowLoad() {
	console.log("Window load");
	var message = document.querySelector('#message');

	chrome.runtime.sendMessage({ action: 'parse' });
}

window.onload = onWindowLoad;