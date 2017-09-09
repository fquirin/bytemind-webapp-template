//requires: 

//list with rich items
function bytemind_build_ui_itemlist(){
	
	var ItemList = function(data, options){
		
		var self = this;
		
		var id = "";
		var hasHeader = true;
		
		var itemType = "plain";
		
		var autoSize = false;
		self.isMinimized = false;
		
		var autoSave = false;

		//read options
		if (options){
			if ('id' in options) id = options.id;
			if ('hasHeader' in options) hasHeader = options.hasHeader;
			if ('itemType' in options) itemType = options.itemType;
			if ('autoSize' in options) autoSize = options.autoSize;
			if ('autoSave' in options) autoSave = options.autoSave;
		};
		
		//create list container
		var listContainer = document.createElement('div');
		listContainer.id = id;
		listContainer.className = 'bytemind-cards-flexSize-container';
		
		//add header
		var listHeader;
		if (hasHeader){
			listHeader = buildHeader(options.header);
			listContainer.appendChild(listHeader);
		}
		
		//add body
		var listBody = buildBody();
		listContainer.appendChild(listBody);
		
		//add items
		if (data.items){
			for (var i=0; i<data.items.length; i++){
				var lItem = makeItem(data.items[i], options);
				listBody.appendChild(lItem);
			}
		}
		
		self.getElement = function(){
			return listContainer;
		}
	}
	
	//make header
	function buildHeader(header){
		var listHeader;
		listHeader = document.createElement('div');
		listHeader.className = 'bytemind-cards-header';
		//style
		if (header.background) listHeader.style.background = header.background;
		if (header.textColor) listHeader.style.color = header.textColor;
		if (header.cssClass) listHeader.className += header.cssClass;
		
		//left button
		
		//title
		var title = makeHeaderTitle(header);
		listHeader.appendChild(title);
		
		//right button
		
		//menu
		var menu = makeHeaderMenu(header.menu);
		if (menu){
			listHeader.appendChild(menu);
		}
		return listHeader;
	}
	//make header title
	function makeHeaderTitle(header){
		var title = document.createElement('div');
		title.className = 'bytemind-cards-header-title';
		title.innerHTML = header.name;
		return title;
	}
	//make header menu
	function makeHeaderMenu(menu){
		var headerMenu;
		if (menu && menu.length > 0){
			headerMenu = document.createElement('div');
			headerMenu.className = 'bytemind-cards-header-menu';
			
			for (var i=0; i<menu.length; i++){
				var menuItem = makeHeaderMenuItem(menu[i])
				headerMenu.appendChild(menuItem);
			}
		}
		return headerMenu;
	}
	//make header menu item
	function makeHeaderMenuItem(menuItemData){
		var menuItem = document.createElement('div');
		menuItem.className = 'bytemind-cards-header-menu-item';
		
		//TODO: evaluate menuData
		
		return menuItem;
	}
	
	//make body
	function buildBody(){
		var lBody = document.createElement('div');
		lBody.className = 'bytemind-cards-body';
		return lBody;
	}
	
	//make item
	function makeItem(itemData, options){
		var lItem = document.createElement('div');
		lItem.className = 'bytemind-cards-item';
		lItem.innerHTML = "<div class='bytemind-cards-item-center'>" + itemData.title + "</div>";
		
		//menu??
		if (options.itemMenu && options.itemMenu.length > 0){
			var itemMenu = document.createElement('div');
			itemMenu.className = 'bytemind-cards-item-menu';
			
			for (var i=0; i<options.itemMenu.length; i++){
				var menuItem = makeItemMenu(options.itemMenu[i])
				itemMenu.appendChild(menuItem);
			}
			lItem.appendChild(itemMenu);
		}
		return lItem;
	}
	//make item menu
	function makeItemMenu(menuData){
		var menuItem = document.createElement('div');
		menuItem.className = 'bytemind-cards-item-menu-item';
		
		//TODO: evaluate menuData
		
		return menuItem;
	}
	
	return ItemList;
}