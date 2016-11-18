var ul = -1;
var l = -.5;
var c = .5;
var uc = 1;

//Reputable classifyng sources 
var news_dict = {};

//News pages 
news_dict["9258148868"] = ul; //New Yorker
news_dict["21516776437"] = ul; //Slate 
news_dict["7976226799"] = ul; //Daily Show 
news_dict["10513336322"] = ul; //The Guardian 
news_dict["132427453584273"] = ul; //Al Jazeera America 
news_dict["10643211755"] = ul; //NPR 
news_dict["5281959998"] = ul; //New York Times 
news_dict["19013582168"] = ul; //PBS 
news_dict["18468761129"] = ul; //HuffPost 
news_dict["56845382910"] = ul; //HuffPost Politics 
news_dict["6250307292"] = ul; //Washington Post 
news_dict["374111579728"] = ul; //Wasington Post Politics 
news_dict["6013004059"] = ul; //The Economist
news_dict["62317591679"] = ul; //Politico 
news_dict["273864989376427"] = ul; //MSNBC 
news_dict["5550296508"] = ul; //CNN 
news_dict["219367258105115"] = ul; //CNN Politics 
news_dict["155869377766434"] = ul; //NBC News 
news_dict["197311240419563"] = ul; // Late Night with Seth Meyers 
news_dict["545775132233909"] = ul; //Late Show with Stephen Colbert 
news_dict["1765033567057615"] = ul; //Full Frontal with Samantha Bee 
news_dict["479042895558058"] = ul; //Last Week Tonight with John Oliver 

news_dict["131459315949"] = l; //CBS News
news_dict["19440638720"] = l; //Wired 
news_dict["20446254070"] = l; //Business Insider 
news_dict["266790296879"] = l; //Bloomberg 
news_dict["1481073582140028"] = l; //Bloomberg Politics 
news_dict["86680728811"] = l; //ABC News
news_dict["13652355666"] = l; //USA Today 
news_dict["21898300328"] = l; //Buzzfeed
news_dict["354263831266028"] = l; //Buzzfeed Politics 
news_dict["29259828486"] = l; //The Atlantic 

news_dict["338028696036"] = c; //Yahoo News
news_dict["8304333127"] = c; //Wall Street Journal 

news_dict["15704546335"] = uc; //Fox News
news_dict["102533606954"] = uc; //Drudge Report
news_dict["95475020353"] = uc; //Breitbart 
news_dict["80256732576"] = uc; //Info Wars
news_dict["136264019722601"] = uc; //Rush Limbaugh Show
news_dict["140738092630206"] = uc; //The Blaze
news_dict["69813760388"] = uc; //Sean Hannity Show
news_dict["36400348187"] = uc; //Glenn Beck Program 
news_dict["85452072376"] = uc; //NewsMax
news_dict["182919686769"] = uc; //DailyCaller
news_dict["912274352202712"] = uc; //DailyCaller Politics
news_dict["35994014410"] = uc; //The Washington Times 

//Fake news  
var ulf = -1;
var lf = -.5;
var cf = .5;
var ucf = 1;

//Fake news classifyng sources 
var fakenews_dict = {};
/*
//Fake news pages 
fakenews_dict["146422995398181"] = ulf; //Addicting Info 
fakenews_dict["177486166274"] = ulf; //Being Liberal 
fakenews_dict["762592150466931"] = ulf; //If You Only News
fakenews_dict["253546571389025"] = ulf; //Bipartisan Report 
fakenews_dict["180213475460766"] = ulf; //Liberal America 
fakenews_dict["20950654496"] = ulf; //The Onion 
fakenews_dict["38423635680"] = ulf; //Andy Borowitz 
fakenews_dict["114517875225866"] = ulf; //The Other 98%
fakenews_dict["11539801009"] = ulf; //National Report 
fakenews_dict["286075841466822"] = ulf; //The Daily Current 
fakenews_dict["1672814509645693"] = ulf; //New Century Times 
fakenews_dict["186219261412563"] = ulf; //US Uncut 
fakenews_dict["1640832309490921"] = ulf; //Winning Democrats 
fakenews_dict["346937065399354"] = ulf; //Occupy Democrats
fakenews_dict["298227226929908"] = ulf; //The Shovel 

fakenews_dict["1439042583002670"] = lf; //Clickhole 
fakenews_dict["131929868907"] = lf; //Collective Evolution 
fakenews_dict["606565022725513"] = lf; //Daily Buzz Live
fakenews_dict["463855417049923"] = lf; //DC Gazette 
fakenews_dict["320840064659503"] = lf; //Newslo 
fakenews_dict["211482380627"] = lf; //Disclove.tv 

fakenews_dict["35590531315"] = cf; //Natural News 
fakenews_dict["114896831960040"] = cf; //WorldTruth.tv

fakenews_dict["311190048935167"] = ucf; //100PercentFedUp
fakenews_dict["820759888034335"] = ucf; //USA Newsflash
fakenews_dict["1425604894326440"] = ucf; //The Free Thought Project 
fakenews_dict["179035672287016"] = ucf; //American News
fakenews_dict["236763656409160"] = ucf; //Project Veritas 
fakenews_dict["687156898054966"] = ucf; //IJR Politics 
fakenews_dict["1578074585774580"] = ucf; //IJR Life
fakenews_dict["80256732576"] = ucf; //Info Wars
fakenews_dict["116727628853"] = ucf; //RedFlag News
fakenews_dict["508887815910815"] = ucf; //BizPac Review
fakenews_dict["106547192707583"] = ucf; //RedState
fakenews_dict["95475020353"] = ucf; //Breitbart 
fakenews_dict["140738092630206"] = ucf; //The Blaze 
fakenews_dict["319569361390023"] = ucf; //Twitchy 
fakenews_dict["245481491808"] = ucf; //Now The End Begins 

//Politicians   
var ulp = -1;
var lp = -.5;
var cp = .5;
var ucp = 1;

//Fake news classifyng sources 
var pol_dict = {};
/*
//Politician Pages 
pol_dict["6815841748"] = ulp; //Barack Obama
pol_dict["22092775577"] = ulp; //Michelle Obama
pol_dict["7860876103"] = ulp; //Joe Biden 
pol_dict["124955570892789"] = ulp; //Bernie Sanders
pol_dict["360249323990357"] = ulp; //Harry Reid 
pol_dict["86574174383"] = ulp; //Nancy Pelosi 
pol_dict["889307941125736"] = ulp; //Hillary Clinton 
pol_dict["7656215652"] = ulp; //Tim Kaine 
pol_dict["482778861771212"] = ulp; //US Senator Tim Kaine 

pol_dict["207116912648950"] = ucp; //Reince Priebus 
pol_dict["259130650776119"] = ucp; //Mitch McConnell 
pol_dict["123994667639233"] = ucp; //Senator Mitch McConnell 
pol_dict["355316521236121"] = ucp; //John Cornyn 
pol_dict["63002536261"] = ucp; //John Thune 
pol_dict["155244824599302"] = ucp; //Paul Ryan 
pol_dict["153080620724"] = ucp; //Donald J. Trump 
pol_dict["133961323610549"] = ucp; //Donald J. Trump for President 
pol_dict["6726182861"] = ucp; //Mike Pence 
pol_dict["316611475124277"] = ucp; //Governor Mike Pence 
pol_dict["77590795932"] = ucp; //John Kasich 
pol_dict["69983322463"] = ucp; //Ted Cruz
pol_dict["58736997707"] = ucp; //Marco Rubio 
pol_dict["138691142964027"] = ucp; //Dr. Ben Carson 
pol_dict["210257445769973"] = ucp; //Jeb Bush 
pol_dict["180381489134"] = ucp; //Chris Christie 
pol_dict["493471480388"] = ucp; //Governor Chris Christie 
pol_dict["261624820205"] = ucp; //Carly Fiorina 
pol_dict["44746457369"] = ucp; //Rick Santorum
pol_dict["54172246106"] = ucp; //Rand Paul 
pol_dict["6934857868"] = ucp; //Mike Huckabee 

function score(post_ids) {
	var score = 0;
	var found = 0;
	var fake = 0;
	for (i = 0; i < post_ids.length; i++) {
		post_id = post_ids[i];
		if (news_dict[post_id]) {
			found++;
			score += news_dict[post_id];
		}
		if (fakenews_dict[post_id]) {
			found++;
			fake++;
			score += fakenews_dict[post_id];
		} else if (pol_dict[post_id]) {
			found++;
			score += pol_dict[post_id];
		}
	}
	return {
		politicalScore: score / found,
		confidence: found / post_ids.length,
		authenticity: fake / found
	};
}
