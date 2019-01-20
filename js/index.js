//---------Pages:

var HOME = "home";

function buildPages(sideMenuEle){
	
	//Home
	ByteMind.page.registerSectionWithNavButton("Home", {
		sectionName : HOME,
		viewId : "page1", 		//use this if you have an ID else use 'view' and give the element
		title : "ByteMind Home",
		headerTitle : "Home",
		description : "This is the landing page."
	}, sideMenuEle);
	
	//Settings
	ByteMind.page.registerSectionWithNavButton("Settings", {
		sectionName : "settings",
		viewId : "page2",
		title : "ByteMind Settings",
		headerTitle : "Settings",
		description : "This is the settings page.",
		onPageLoad : function(){
			var cssFiles = [];	//e.g. ["css/settings.css"]
			var jsFiles = [];	//e.g. ["js/settings.js"]
			ByteMind.page.import("settings", "settings.html", "#page-content", cssFiles, jsFiles, function(ele){
				//Finished loading
			});
		}
	}, sideMenuEle);
	
	//Imprint
	ByteMind.page.registerSectionWithNavButton("Imprint", {
		sectionName : "imprint",
		viewId : "page3",
		title : "ByteMind Imprint",
		headerTitle : "Imprint",
		description : "This is the imprint page.",
	}, sideMenuEle);
	
}

//---------Webservice:

function setupWebserviceClass(){
	//Some required configuration
	ByteMind.webservice.apiURL = "https://api.example.com";
}

//---------Account:

function setupAccountClass(){
	//Some required account configuration
	ByteMind.account.apiURL = "https://api.example.com";
	ByteMind.account.tokenValidTime = 1000*60*60*24; 	//refresh of account.userToken required after e.g. 1 day
	
	//Request info of LOGIN call
	ByteMind.account.getLoginRequestData = function(userId, pwd, isClearText){
		//hash password?
		if (pwd && isClearText){
			//encrypt
			pwd = ByteMind.account.getSHA256(pwd);
		}
		var requestBody = {
			action: "validate",
			//GUUID: userId,	//<-- DONT USE THAT IF ITS NOT ABSOLUTELY NECESSARY (USE 'KEY') ...
			//PWD: pwd,			//... it sends clear text password (and is a much heavier load for the server!)
			KEY: (userId + ";" + pwd),
			client: ByteMind.config.clientInfo
		}
		var request = {
			url: ByteMind.account.apiURL + "/authentication",
			timeout: 5000,
			type: "POST",
			data: JSON.stringify(requestBody),
			headers: {
				"content-type": "application/json"
			}
		}
		return request;
	}
	//Success condition for LOGIN call
	ByteMind.account.loginSuccessTest = function(data){
		return (data.result && data.result === "success");
	}
	
	//Request info of LOGOUT call
	ByteMind.account.getLogoutRequestData = function(){
		var account = ByteMind.account.getData() || {};
		var requestBody = {
			action: "logout",
			KEY: (account.userId + ";" + account.userToken),
			client: ByteMind.config.clientInfo
		}
		var request = {
			url: ByteMind.account.apiURL + "/authentication",
			timeout: 5000,
			type: "POST",
			data: JSON.stringify(requestBody),
			headers: {
				"content-type": "application/json"
			}
		}
		return request;
	}
	//Success condition for LOGOUT call
	ByteMind.account.logoutSuccessTest = function(data){
		return (data.result && data.result === "success");
	}

	//Called during login success to store data (data=login API call answer as JSON).
	//Overwrite as you need, keep left side (e.g. account.userId=...) to retain login logic
	ByteMind.account.storeData = function(data){
		var account = new Object();
		account.userId = data.uid;
		account.userToken = data.keyToken;
		account.language = data.user_lang_code;
		return account;
	}
}

//---------Load on start:

//Run just before ByteMind.account tries to restore account data
function beforeLoginRestore(){
	
	//-- Your stuff --
	//...
}

//Last action after initialization
function onStart(){
	
	//-- Your stuff --
	//...	
}