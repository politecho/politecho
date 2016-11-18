function parseDOM(document_root) {
	var share_buttons = document_root.getElementsByClassName('_15kr _5a-2');
	var ids = [];
	
	for (var i = 0; i < share_buttons.length; i++) {
		ids.push(JSON.parse(share_buttons[i].getAttribute('data-store')).share_id);
	}
	return ids.toString();
}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://m.facebook.com/search/5281959998/stories-by/1662722772/stories-liked/intersect?__mref=message_bubble', true);
xhr.onreadystatechange = function(e) {
	
	var count = (xhr.responseText.match(/_15kr _5a-2/g) || []).length;
	
  chrome.runtime.sendMessage({
    action: "parse",
    source: count
  });
};
xhr.send();

/*
chrome.runtime.sendMessage({
    action: "parse",
    source: parseDOM(document)
});*/