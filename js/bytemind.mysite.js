//---BUILD PAGE---

var HOME = "home";

$(document).ready(function(){
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
		isRightBound : false,					//default menu is on the left side
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
		title : "ByteMind P1",
		headerTitle : "Home",
		description : "This is the landing page."
	}, sideMenuEle);
	
	//More
	ByteMind.page.registerSectionWithNavButton("More", {
		sectionName : "more",
		viewId : "page2",
		title : "ByteMind P2",
		headerTitle : "Page 2",
		description : "This is the other page.",
		onPageLoad : function(){
			/*
			var content = document.getElementById('p2-dynamic-content');
			if (content.innerHTML === ''){
				$(content).load("../other.html #content", function(){
					//done
				});
			}
			*/
		}
	}, sideMenuEle);
	
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

