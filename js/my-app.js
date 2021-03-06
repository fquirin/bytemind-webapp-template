//---BUILD PAGE---

var HOME = "home";

$(document).ready(function(){
	//-- Chrome/Android (and whoever will support it) --
	
	//handle Chrome progressive app popup for home-screen installation
	window.addEventListener('beforeinstallprompt', function(e) {
		//e.preventDefault(); 		//use this to prevent pop-up
		return false;
	});
	
	//handle service worker to make page offline available
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('sw.js').then(function(registration) {
				// Registration was successful
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			}, function(err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			});
		});
	}
	
	//-- ByteMind --
	
	//load plugins
    ByteMind.buildPlugins();
	
	//setup page
	ByteMind.ui.setup();
	buildNavigation();
	
	//debug
	var clientInfo = document.createElement('span');
	clientInfo.innerHTML = ByteMind.config.clientInfo;
	$(clientInfo).css({position:'fixed', bottom:'0', right:'0', 'z-index':'99', opacity:'0.33', 'font-size':'11px'});
	$('body').append(clientInfo);
	
	//check page actions and register hashchange event listener
	if (!ByteMind.page.checkUrlForAction()){
		ByteMind.page.activateActionByName(HOME, { animate:false, replaceHistory:true });
	}
	window.onhashchange = function(){
		ByteMind.page.checkUrlForAction();
	};
	
	//refresh
	ByteMind.ui.onclick(document.getElementById('bytemind-refresh-btn'), function(){
		window.location.reload(true);
	});
		
	//fullscreen
	$('#bytemind-fullscreen-btn, #bytemind-fullscreen-overlay-btn').each(function(){
		ByteMind.ui.onclick(this, function(){
			$('#bytemind-webapp-header').toggleClass('hide');
			$('#bytemind-webapp-top-bar').toggleClass('hide');
			$('#bytemind-webapp-footer').toggleClass('hide');
			$('#bytemind-fullscreen-overlay-btn').fadeToggle(300);
		});
	});
	
	//test
	ByteMind.webservice.apiURL = "https://api.example.com/";
	ByteMind.account.apiURL = "https://api.example.com/";
	ByteMind.account.setup();
	
	//-- Your stuff --
	//...
	
});

function buildNavigation(){
	var menuBar = document.getElementById('bytemind-webapp-top-bar');
	var menuBarDyn = document.getElementById('bytemind-webapp-top-bar-dynamic');
	
	//Side menu
	var sideMenuEle = document.getElementById('my-bytemind-side-menu');
	var swipeArea = ByteMind.ui.makeAutoResizeSwipeArea(document.getElementById('my-bytemind-side-menu-swipe'), function(){
		//console.log('tap');
	});
	var sideMenuOptions = {
		isRightBound : false,					//default menu is on the left side, if you change it make sure to use a right-bound swipeArea as well!
		swipeAreas : [sideMenuEle, swipeArea],	//areas that can be used to swipe open and close the menu
		onOpenCallback : function(){},
		onCloseCallback : function(){},
		interlayer : '#my-bytemind-side-menu-interlayer',
		menuButton : '#bytemind-menu-btn-ctrl',
		menuButtonClose : '#my-bytemind-menu-close'
	};
	ByteMind.page.sideMenu = new ByteMind.ui.SideMenu(sideMenuEle, sideMenuOptions);
	ByteMind.page.sideMenu.init();
	
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
	
	//Add logout button?
	if (ByteMind.account){
		ByteMind.page.registerMenuButton("Sign out", {
			//href : "/logout.html",
			onclick : function() { ByteMind.page.sideMenu.close(); 	ByteMind.account.logoutAction(); }
		}, sideMenuEle);
	}
	
	//use side menu?
	/*
	menuButtonsTotalWidth = 48;
	$(menuBar).children().each(function(){
		menuButtonsTotalWidth += $(this).outerWidth(true);
	});
	refreshNavigation(menuBar, ByteMind.page.sideMenu);
	$(window).on('load resize orientationchange', function() {
		refreshNavigation(menuBar, ByteMind.page.sideMenu);
	});
	*/
}
/*
var useSideMenu = false;
var menuButtonsTotalWidth;
function refreshNavigation(menuBar, sideMenu){
	var sideMenuEle = sideMenu.getMenuElement();
	if (!sideMenuEle){
		return;
	}
	var mainWidth = $(menuBar).outerWidth();
	var $menuBarDyn = $(menuBar).find('#bytemind-webapp-top-bar-dynamic');		//TODO: make non constant
	
	if (!useSideMenu){
		if (mainWidth <= menuButtonsTotalWidth){
			useSideMenu = true;
			var menuButtons = $menuBarDyn.find('.bytemind-nav-bar-button').not('#bytemind-menu-btn-ctrl');
			menuButtons.detach();
			menuButtons.appendTo(sideMenuEle);

			sideMenu.refresh();
			sideMenu.close(true);

			$('#bytemind-menu-btn-ctrl').show();
			//make exceptions for iOS
			if (!ByteMind.ui.isSafari || ByteMind.ui.isStandaloneWebApp){
				$('#my-bytemind-side-menu-swipe').show();
			}else{
				$('#my-bytemind-side-menu-swipe').hide();
			}
		}
	}else{
		if (mainWidth > menuButtonsTotalWidth){
			useSideMenu = false;
			var menuButtons = $(sideMenuEle).find('.bytemind-nav-bar-button').not('#bytemind-menu-btn-ctrl');
			menuButtons.detach();
			menuButtons.appendTo($menuBarDyn[0]);
			
			sideMenu.refresh();
			sideMenu.close(true);

			$('#bytemind-menu-btn-ctrl').hide();
			//make exceptions for iOS
			if (!ByteMind.ui.isSafari || ByteMind.ui.isStandaloneWebApp){
				$('#my-bytemind-side-menu-swipe').hide();
			}else{
				$('#my-bytemind-side-menu-swipe').show();
			}
		}
	}
}
*/

