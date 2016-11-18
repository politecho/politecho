window.load = function() {
	console.log("sup")
	var news_dict = {}; 
	news_dict["9258148868"] = 1; 
	news_dict["21516776437"] = 1; 

	function score(post_ids) {
		var score; 
		var found; 
		for (i = 0; i < post_ids.length; i++) {
			post_id = post_ids[i]; 
			if (news_dict[post_id]) {
				found++; 
				score += news_dict[post_id]; 
			}
		}
		return score; 
	}

	console.log(score(["9258148868", "21516776437"]))
}