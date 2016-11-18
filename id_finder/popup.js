chrome.runtime.onMessage.addListener(function (request, sender) {
	if (request.action == "parseResponse") {
		message.innerText += "\n[" + request.source.toString() + "]";
	}
});

var news_dict = {};
var ul = undefined;
news_dict["9258148868"] = ul; //New Yorker
news_dict["21516776437"] = ul; //Slate 
news_dict["7976226799"] = ul; //Daily Show 
// news_dict["10513336322"] = ul; //The Guardian 
// news_dict["132427453584273"] = ul; //Al Jazeera America 
// news_dict["10643211755"] = ul; //NPR 
news_dict["5281959998"] = ul; //New York Times 
news_dict["19013582168"] = ul; //PBS 
news_dict["18468761129"] = ul; //HuffPost 
// news_dict["56845382910"] = ul; //HuffPost Politics 
// news_dict["6250307292"] = ul; //Washington Post 
// news_dict["374111579728"] = ul; //Wasington Post Politics 
// news_dict["6013004059"] = ul; //The Economist
// news_dict["62317591679"] = ul; //Politico 
// news_dict["273864989376427"] = ul; //MSNBC 
// news_dict["5550296508"] = ul; //CNN 
// news_dict["219367258105115"] = ul; //CNN Politics 
// news_dict["155869377766434"] = ul; //NBC News 
// news_dict["197311240419563"] = ul; // Late Night with Seth Meyers 
// news_dict["545775132233909"] = ul; //Late Show with Stephen Colbert 
// news_dict["1765033567057615"] = ul; //Full Frontal with Samantha Bee 
// news_dict["479042895558058"] = ul; //Last Week Tonight with John Oliver 

function onWindowLoad() {
	console.log("Window load");
	message = document.querySelector('#message');

	// chrome.runtime.sendMessage({
	// 	action: 'parse',
	// 	userId: '1662722772',
	// 	newsSourceIds: Object.keys(news_dict),
	// });
	// message.innerText = "URL: " + chrome.extension.getURL("index.html");
	// chrome.tabs.create({url: 'index.html'});
}

window.onload = onWindowLoad;