//required: sjcl, jQuery, ByteMind.ui, ByteMind(core)

//WEBSERVICE connectors
function bytemind_build_webservice(){
	var Webservice = {};
	
	Webservice.apiURL = "http://localhost:8001/";
	
	//ping server
	Webservice.ping = function(successCallback, failCallback, failOfflineCallback){
		ByteMind.ui.showLoader();
		$.ajax({
			url: (Webservice.apiURL + "ping"),
			timeout: 3000,
			dataType: "jsonp",
			success: function(data) {
				ByteMind.ui.hideLoader();
				if (data.result && data.result === "fail"){
					if (failCallback) failCallback(data);
				}else{
					serverName = data.serverName;
					if (successCallback) successCallback(data);
				}
			},
			error: function(data) {
				if (!failOfflineCallback) failOfflineCallback = ByteMind.ui.showPopup(ByteMind.local.g('noConnectionToNetwork'), getTryAgainPopupConfigAfterConnectionFail());
				Webservice.checkNetwork(failCallback, failOfflineCallback);
			}
		});
	}
	//check network
	Webservice.checkNetwork = function(successCallback, failCallback){
		ByteMind.ui.showLoader(true);
		$.ajax({
			url: ("https://google.com"),
			timeout: 1500,
			method: "HEAD",
			success: function(data) {
				ByteMind.ui.hideLoader();
				if (successCallback) successCallback(data);
			},
			error: function(data) {
				ByteMind.ui.hideLoader();
				if (failCallback) failCallback(data);
			}
		});
	}
	function getTryAgainPopupConfigAfterConnectionFail(){
		var config = {
			buttonTwoName : ByteMind.local.g('tryAgain'),
			buttonTwoAction : function(){
				ByteMind.account.afterLogin();
			}
		}
		return config;
	}
	
	return Webservice;
}

//ACCOUNT - Login, logout, login-popup etc. ...	
function bytemind_build_account(){
	var Account = {};
	
	Account.apiURL = "http://localhost:8001/";
	
	var userId = "";
	var userToken = "";
	var userName = "Boss";
	var language = ByteMind.config.language;
	
	var pwdIsToken = false;
	
	//---- Account settings mapping (to simplify access) ----//
	Account.NICK_NAME = "nickName";
	Account.FIRST_NAME = "firstName";
	Account.LAST_NAME = "lastName";
	Account.LANGUAGE = "language";
	
	//Mapping between app-fields and database-fields (for your convenience) 
	var userSettingsMap = {
		"nickName" : "name.nick",
		"firstName" : "name.first",
		"lastName" : "name.last",
		"language" : "language"
	}
	
	//---- broadcasting ----
	
	//login
	function broadcastLoginSuccess(){
	}
	function broadcastLoginFail(){
	}	
	//logout
	function broadcastLogoutTry(){
	}
	function broadcastLogoutSuccess(){
	}
	function broadcastLogoutFail(){
	}
	
	//----------------------
	
	//get user id
	Account.getUserId = function(){
		return userId;
	}
	//get user name
	Account.getUserName = function(){
		return userName;
	}
	//get key
	Account.getKey = function(){
		return (userId + ";" + userToken);
	}
	//get token
	Account.getToken = function(){
		return userToken;
	}
	//get language
	Account.getLanguage = function(){
		return language;
	}
	
	//save account settings value
	Account.saveAccountField = function(field, value){
		var mappedField = userSettingsMap[field];
		var data = {};
		data[mappedField] = value;
		var writeData = {};
		writeData.attributes = data;
		Account.setData("", writeData, function(data){
			ByteMind.debug.log('Account - successfully stored field: ' + field);
		}, function(msg){
			ByteMind.ui.showPopup(msg);
		});
	}
	
	//Create login box (and keep hidden)
	Account.createLoginBox = function(parentEle){
		var parent = (parentEle)? parentEle : document.body;
		var box = document.createElement('div');
		box.id = 'bytemind-login-box';
		box.style.display = 'none';
		box.innerHTML = "" +
			'<div id="bytemind-login-language-selector"></div>' +
			'<h2>' + ByteMind.local.g('welcome') + '</h2>' +
			'<input id="bytemind-login-id" type="email" placeholder="Username" aria-label="Username">' +
			'<input id="bytemind-login-pwd" type="password" placeholder="Password" aria-label="Password">' + 
			'<button id="bytemind-login-send">' + ByteMind.local.g('sendLogin') + '</button><br>' +
			'<button id="bytemind-login-close">' + ByteMind.local.g('closeLogin') + '</button><br>' +
			'<p id="bytemind-login-status"><br></p>';
		$(parent).append(box);
		
		//login-button
		var logSendBtn = document.getElementById("bytemind-login-send");
		if (logSendBtn){
			$(logSendBtn).off();
			$(logSendBtn).on("click", function () {
				sendLoginFromBox();
			});
		}
		//id placeholder
		var idInput = document.getElementById("bytemind-login-id");
		idInput.placeholder = ByteMind.local.username;
		$(idInput).off();
		$(idInput).on("keypress", function (e) {
			if (e.keyCode === 13) { sendLoginFromBox(); }
		});
		//keypress on pwd
		var pwdInput = document.getElementById("bytemind-login-pwd");
		pwdInput.placeholder = ByteMind.local.password;
		$(pwdInput).off();
		$(pwdInput).on("keypress", function (e) {
			if (e.keyCode === 13) { sendLoginFromBox(); }
		});
		//close-button
		var clsBtn = document.getElementById("bytemind-login-close");
		if (clsBtn){
			$(clsBtn).off();
			$(clsBtn).on("click", function () {
				Account.toggleLoginBox();
				Account.afterLogin();
			});
		}
		//add language selector
		var langSelBox = document.getElementById("bytemind-login-language-selector");
		if (langSelBox){
			//TODO:
			/*
			langSelBox.appendChild(SepiaFW.ui.build.languageSelector("bytemind-login-language-dropdown", function(selectedLanguage){
				var url = SepiaFW.tools.setParameterInURL(window.location.href, 'lang', selectedLanguage);
				window.location.href = url;
			}));
			*/
		}
		
		return box;
	}
	
	//Setup login-box
	Account.setup = function(){
		//try restore from localStorage to avoid login popup - refresh required after e.g. 1 day = 1000*60*60*24
		var account = ByteMind.data.get('account');
		if (account && account.userToken && account.lastRefresh && ((new Date().getTime() - account.lastRefresh) < (1000*60*60*12))){
			userId = account.userId;
			userToken = account.userToken;
			userName = account.userName;	if (userName)	ByteMind.config.broadcastUserName(userName);
			language = account.language;	if (language)	ByteMind.config.broadcastLanguage(language);
			ByteMind.debug.log('Account: login restored');
			
			var lBox = document.getElementById("bytemind-login-box");
			if (lBox && lBox.style.display != 'none'){
				Account.toggleLoginBox();
			}
			Account.afterLogin();

		//try refresh
		}else if (account && account.userToken){
			ByteMind.debug.log('Account: trying login auto-refresh with token');
			pwdIsToken = true;
			Account.login(account.userId, account.userToken, onLoginSuccess, onLoginError, onLoginDebug);
		
		//open login box
		}else{
			var lBox = document.getElementById("bytemind-login-box");
			if (!lBox || lBox.style.display == 'none'){
				Account.toggleLoginBox();
			}
		}
	}
	function sendLoginFromBox(){
		pwdIsToken = false;
		var id = document.getElementById("bytemind-login-id").value;
		var pwdField = document.getElementById("bytemind-login-pwd");
		var pwd = pwdField.value;
		pwdField.value = '';
		if (id && pwd && (id.length > 3) && (pwd.length > 5)) {
			userId = id;
			Account.login(userId, pwd, onLoginSuccess, onLoginError, onLoginDebug);
		}else{
			onLoginError(ByteMind.local.g('loginFailedPlain'));
		}
	}
	function onLoginSuccess(data){
		var lBox = document.getElementById("bytemind-login-box");
		if (lBox && lBox.style.display != 'none'){
			Account.toggleLoginBox();
		}
		
		userToken = data.keyToken;
		userId = data.uid;
		//get call name
		if (data.user_name && data.user_name.length > 3){
			var unn = data.user_name.replace(/.*<nickN>(.*?)(<|$).*/,"$1");
			unn = (unn == data.user_name)? "" : unn;
			var unf = data.user_name.replace(/.*<firstN>(.*?)(<|$).*/,"$1");
			unf = (unf == data.user_name)? "" : unf;
			if (unn.length>1){
				userName = unn;
			}else if (unf.length>1){
				userName = unf;
			}
			//ByteMind.debug.info(unn  + ", " + unf + ", " + data.user_name);
			//broadcast
			ByteMind.config.broadcastUserName(userName);
		}
		//get preferred language
		if (data.user_lang_code && data.user_lang_code.length > 1){
			language = data.user_lang_code;
			ByteMind.config.broadcastLanguage(language);
		}
		
		//store data
		var account = new Object();
		account.userId = userId;
		account.userToken = userToken;
		account.userName = userName;
		account.language = language;
		account.lastRefresh = new Date().getTime();
		ByteMind.data.set('account', account);
		
		//what happens next? typically this is used by a client implementation to continue
		broadcastLoginSuccess();
		Account.afterLogin();
	}
	function onLoginError(errorText){
		var lBoxError = document.getElementById("bytemind-login-status");
		if(lBoxError){
			lBoxError.innerHTML = errorText;
			$(lBoxError).fadeOut(150).fadeIn(150);
		}else{
			ByteMind.debug.err('Login: ' + errorText);
		}
		broadcastLoginFail();
	}
	function onLoginDebug(data){
		//ByteMind.debug.log('Account debug: ' + JSON.stringify(data));
	}
	
	//toggle login box on off
	Account.toggleLoginBox = function(){
		var box = document.getElementById("bytemind-login-box");
		if (box){
			$("#bytemind-login-status").html('');		//reset status text
			if (box.style.display == 'none'){
				$(box).fadeIn(300);
				if (ByteMind.ui){
					ByteMind.ui.showBackgroundCoverLayer($(box).parent()[0]);
				}
			}else{
				//box.style.display = 'none';
				$(box).fadeOut(300);
				if (ByteMind.ui){
					ByteMind.ui.hideBackgroundCoverLayer($(box).parent()[0]);
				}
			}
		}else{
			Account.createLoginBox();
			Account.toggleLoginBox();
		}
	}
	
	//Logout action e.g. for button
	Account.logoutAction = function(){
		//try logout - fails silently (low prio, good idea?)
		if (userId && userToken){
			Account.logout((userId + ";" + userToken), onLogoutSuccess, onLogoutFail, onLogoutDebug);
		}
		//remove data
		ByteMind.data.del('account');
		//open box
		var lBox = document.getElementById("bytemind-login-box");
		if (lBox && lBox.style.display == 'none'){
			Account.toggleLoginBox();
		}
		broadcastLogoutTry();
		//do other user/client actions
		Account.afterLogout();
	}
	function onLogoutSuccess(data){
		ByteMind.debug.log('Account: logout successful');
		broadcastLogoutSuccess();
	}
	function onLogoutFail(data){
		ByteMind.debug.err('Account: complete logout failed! But local data has been removed.');
		broadcastLogoutFail();
	}
	function onLogoutDebug(data){
		//ByteMind.debug.log('Account debug: ' + JSON.stringify(data));
	}
	
	//---- API communication ----
	
	//LOGIN
	Account.login = function(userid, pwd, successCallback, errorCallback, debugCallback){
		ByteMind.ui.showLoader();
		//hash password
		if (pwd && !pwdIsToken){
			//encrypt
			pwd = getSHA256(pwd);
		}
		//call authentication API for validation
		var api_url = Account.apiURL + "authentication";
		var parameters = new Object();
		parameters.action = "validate";
		parameters.KEY = userid + ";" + pwd;
		//parameters.GUUID = userid;		//<-- DONT USE THAT IF ITS NOT ABSOLUTELY NECESSARY (its bad practice and a much heavier load for the server!)
		//parameters.PWD = pwd;
		parameters.client = ByteMind.config.clientInfo;
		//ByteMind.debug.info('URL: ' + api_url);
		$.ajax({
			url: api_url,
			timeout: 5000,
			type: "post",
			data: parameters,
			dataType: "jsonp",
			success: function(data) {
				ByteMind.ui.hideLoader();
				if (debugCallback) debugCallback(data);
				if (data && data.result){
					var status = data.result;
					if (status == "fail"){
						if (data.code && data.code == 3){
							if (errorCallback) errorCallback(ByteMind.local.g('loginFailedServer'));
						}else{
							if (errorCallback) errorCallback(ByteMind.local.g('loginFailedUser'));
						}
						return;
					}
					//assume success
					else{
						if(data.keyToken && (data.keyToken.length > 7)){
							//----callback----
							if (successCallback) successCallback(data);
						}
					}		
				}else{
					if (errorCallback) errorCallback("Login failed! Sorry, but there seems to be an unknown error :-(");
				}
			},
			error: function(data) {
				ByteMind.ui.hideLoader();
				ByteMind.webservice.checkNetwork(function(){
					if (errorCallback) errorCallback("Login failed! Sorry, but it seems the server does not answer :-(");
				}, function(){
					if (errorCallback) errorCallback("Login failed! Sorry, but it seems you are offline :-(");
				});
				if (debugCallback) debugCallback(data);
			}
		});
	}
	Account.afterLogin = function(){};
	
	//LOGOUT
	Account.logout = function(key, successCallback, errorCallback, debugCallback){
		ByteMind.ui.showLoader();
		var api_url = Account.apiURL + "authentication";
		var parameters = new Object();
		parameters.action = "logout";
		parameters.KEY = key;
		parameters.client = ByteMind.config.clientInfo;
		$.ajax({
			url: api_url,
			timeout: 5000,
			type: "post",
			data: parameters,
			dataType: "jsonp",
			success: function(data) {
				ByteMind.ui.hideLoader();
				if (debugCallback) debugCallback(data);
				if (data.result && data.result === "fail"){
					if (errorCallback) errorCallback('Sorry, but the log-out process failed! Please log-in again to overwrite old token.');
					return;
				}
				//--callback--
				if (successCallback) successCallback(data);
			},
			error: function(data) {
				ByteMind.ui.hideLoader();
				ByteMind.webservice.checkNetwork(function(){
					if (errorCallback) errorCallback('Sorry, but the logout process failed because the server could not be reached :-( Please wait a bit and then log-in again to overwrite old token!');
				}, function(){
					if (errorCallback) errorCallback('Sorry, but the logout process failed because it seems you are offline :-( Please wait for a connection and then simply log-in again.');
				});
				if (debugCallback) debugCallback(data);
			}
		});
	}
	Account.afterLogout = function(){};
	
	//GET DATA
	Account.getData = function(key, accountData, successCallback, errorCallback, debugCallback){
		var apiUrl = Account.apiURL + "userData";
		var parameters = new Object();
		parameters.action = "get";
		accountDataTransfer(apiUrl, parameters, key, accountData, successCallback, errorCallback, debugCallback);
	}
	//SEND DATA
	Account.setData = function(key, accountData, successCallback, errorCallback, debugCallback){
		var apiUrl = Account.apiURL + "userData";
		var parameters = new Object();
		parameters.action = "set";
		accountDataTransfer(apiUrl, parameters, key, accountData, successCallback, errorCallback, debugCallback);
	}
	//DELETE DATA
	Account.deleteData = function(key, accountData, successCallback, errorCallback, debugCallback){
		var apiUrl = Account.apiURL + "userData";
		var parameters = new Object();
		parameters.action = "delete";
		delete accountData.lists.data;		//<- remove data to save some space, it is not necessary to identify the list
		accountDataTransfer(apiUrl, parameters, key, accountData, successCallback, errorCallback, debugCallback);
	}
	//set, get or delete data
	function accountDataTransfer(apiUrl, parameters, key, accountData, successCallback, errorCallback, debugCallback){
		ByteMind.ui.showLoader();
		if (!parameters) parameters = new Object();
		if (key){
			parameters.KEY = key;
		}else if (userId && userToken){
			parameters.KEY = (userId + ";" + userToken);
		}else{
			if (errorCallback) errorCallback("Data transfer failed! Not authorized or missing 'KEY'");
			return;
		}
		parameters.client = ByteMind.config.clientInfo;
		if (accountData.attributes) parameters.attributes = JSON.stringify(accountData.attributes);
		if (accountData.lists) parameters.lists = JSON.stringify(accountData.lists);
		//ByteMind.debug.log('URL: ' + apiUrl);
		//ByteMind.debug.log('Parameters: ' + JSON.stringify(parameters));
		$.ajax({
			url: apiUrl,
			timeout: 15000,
			type: "post",
			data: parameters,
			dataType: "jsonp",
			success: function(data) {
				ByteMind.ui.hideLoader();
				if (debugCallback) debugCallback(data);
				if (data && data.result){
					var status = data.result;
					if (status == "fail"){
						if (data.code && (data.code == 3 || data.result_code == 3)){
							if (errorCallback) errorCallback("Data transfer failed! Communication error(?) - Msg: " + data.error);
						}else{
							if (errorCallback) errorCallback("Data transfer failed! Msg: " + data.error);
						}
						return;
					}
					//assume success
					else{
						if (successCallback) successCallback(data);
					}		
				}else{
					if (errorCallback) errorCallback("Data transfer failed! Sorry, but there seems to be an unknown error :-(");
				}
			},
			error: function(data) {
				ByteMind.ui.hideLoader();
				ByteMind.webservice.checkNetwork(function(){
					if (errorCallback) errorCallback("Data transfer failed! Sorry, but it seems you are offline :-(");
				}, function(){
					if (errorCallback) errorCallback("Data transfer failed! Sorry, but it seems the network or the server do not answer :-(");
				});
				if (debugCallback) debugCallback(data);
			}
		});
	}
	
	//------------- helpers ---------------
	
	//sha256 hash + salt
	Account.pwdHashSalt = "salty1";
	function getSHA256(data){
		return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(data + Account.pwdHashSalt));
	}
	
	//-------------------------------------
	
	return Account;
}