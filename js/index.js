//Pages:

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
			var content = document.getElementById('settings-page-content');
			if (content.innerHTML === ''){
				if (location.hostname === ""){
					content.innerHTML = '<p>-- cannot dynamically load from file:// due to cross-domain restrictions. Please use webserver or localhost! --</p>';
				}else{
					$(content).load("settings.html #page-content", function(){
						//done
					});
				}
			}
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

//Load on start:

function onStart(){
	
	//-- Your stuff --
	//...
	
}