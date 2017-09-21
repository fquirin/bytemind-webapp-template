//requires: 

//list with rich items
function bytemind_build_ui_itemlist(){
	
	var ItemList = function(data, options){
		
		var self = this;
		
		var id = "";
		var hasHeader = false;
		
		var itemType = "plain";
		
		var autoSize = false;
		var autoSizeN = 2;
		self.hasExtendButton = false;
		self.isMinimized = false;
		
		var autoSave = false;

		//read options
		if (options){
			if ('id' in options) id = options.id;
			if ('hasHeader' in options) hasHeader = options.hasHeader;
			if ('itemType' in options) itemType = options.itemType;
			if ('autoSize' in options) autoSize = options.autoSize;
			if ('autoSizeN' in options) autoSizeN = options.autoSizeN;
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
		var initialItemsN = 0;
		if (data.items){
			for (var i=0; i<data.items.length; i++){
				var lItem = makeItem(data.items[i], options);
				listBody.appendChild(lItem);
				initialItemsN++;
				//check autoSize
				if (autoSize && (initialItemsN > autoSizeN)){
					$(lItem).addClass('auto-size');
					lItem.style.display = 'none';
				}
			}
		}
		
		//add footer with extend button?
		if (autoSize && (initialItemsN > autoSizeN)){
			self.hasExtendButton = true;

			var listFooter = buildFooter(self.hasExtendButton, listBody);
			listContainer.appendChild(listFooter);
		}
		
		self.getElement = function(){
			return listContainer;
		}
		
		//-------- LIST CONTROL ---------
		
		function broadcastListChange(){
		}
		
		self.scheduleSaveList = function(){
		}
		
		self.saveList = function(){
		}
		
		self.getData = function(){
		}
		
		//----------- HEADER ------------
	
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
				//add button
				$(title).on('click', function(){
					//$(menu).toggleClass('bytemind-minimize-y');
					$(menu).slideToggle(300);
				});
			}
			return listHeader;
		}
		//make header title
		function makeHeaderTitle(header){
			var title = document.createElement('div');
			title.className = 'bytemind-cards-header-title';
			title.innerHTML = '<p>' + header.name + '</p>';
			return title;
		}
		//make header menu
		function makeHeaderMenu(menu){
			var headerMenu;
			if (menu && menu.length > 0){
				headerMenu = document.createElement('div');
				headerMenu.className = 'bytemind-cards-header-menu';
				headerMenu.style.display = 'none';
				
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
			
			//pre-defined buttons with actions
			if (menuItemData.action){
				switch(menuItemData.action) {
					
					//edit name
					case 'editName':
						menuItem.innerHTML = "<i class='material-icons bm-menu-small'>edit</i>";
						break;
						
					//add
					case 'addItem':
						menuItem.innerHTML = "<i class='material-icons bm-menu-small'>add</i>";
						break;
					
					//share list
					case 'shareList':
						menuItem.innerHTML = "<i class='material-icons bm-menu-small'>share</i>";
						break;
					
					//delete list
					case 'deleteList':
						menuItem.innerHTML = "<i class='material-icons bm-menu-small'>delete</i>";
						break;
				}
			
			//custom buttons with functions
			}else if (menuItemData.fun){
				//use material icon
				if (menuItemData.materialIcon){
					menuItem.innerHTML = "<i class='material-icons bm-menu-small'>" + menuItemData.materialIcon + "</i>";
				}
			}
			return menuItem;
		}
		
		//----------- BODY ------------
		
		//build body
		function buildBody(){
			var lBody = document.createElement('div');
			lBody.className = 'bytemind-cards-body';
			return lBody;
		}
		
		//----------- FOOTER ------------
		
		//build footer
		function buildFooter(hasExtendButton, listBody){
			var lFooter = document.createElement('div');
			lFooter.className = 'bytemind-cards-footer';
			
			//autoSize extend button?
			if (hasExtendButton){
				lFooter.innerHTML = '<i class="material-icons bm-menu-small">arrow_drop_down</i>';
				
				$(listBody).data('isMinimized', true);
				$(lFooter).on('click', function(){
					if ($(listBody).data('isMinimized')){
						$(listBody).find('.auto-size').slideDown(300);
						$(listBody).data('isMinimized', false);
						lFooter.innerHTML = '<i class="material-icons bm-menu-small">arrow_drop_up</i>';
					}else{
						$(listBody).find('.auto-size').slideUp(300);
						$(listBody).data('isMinimized', true);
						lFooter.innerHTML = '<i class="material-icons bm-menu-small">arrow_drop_down</i>';
					}
				});
			}
			
			return lFooter;
		}
		
		//----------- ITEMS ------------
		
		//make item
		function makeItem(itemData, options){
			var lItem = document.createElement('div');
			lItem.className = 'bytemind-cards-item';
			$(lItem).data('itemData', itemData);
			
			//center is always there
			var lItemCenter = document.createElement('div');
			lItemCenter.className = 'bytemind-cards-item-center';
			lItemCenter.innerHTML = "<p>" + itemData.title + "</p>";

			var lItemLeft;
			var lItemRight;
			
			//add stuff depending on type
			if (options && options.itemType){
				//3-fold item
				if (options.itemType === "3fold"){
					//left
					lItemLeft = document.createElement('div');
					lItemLeft.className = 'bytemind-cards-item-left';
					//on build:
					if (options.itemActions && options.itemActions.leftOnBuild){
						options.itemActions.leftOnBuild(itemData, lItemLeft);
					}
					//on click:
					if (options.itemActions && options.itemActions.leftOnClick){
						$(lItemLeft).on('click', function(){
							options.itemActions.leftOnClick(itemData, lItemLeft);
							broadcastListChange();
						});
					}
					lItem.appendChild(lItemLeft);
					
					//right
					lItemRight = document.createElement('div');
					lItemRight.className = 'bytemind-cards-item-right';
					//on build:
					if (options.itemActions && options.itemActions.rightOnBuild){
						options.itemActions.rightOnBuild(itemData, lItemRight);
					}
					//on click:
					if (options.itemActions && options.itemActions.rightOnClick){
						$(lItemRight).on('click', function(){
							options.itemActions.rightOnClick(itemData, lItemRight);
							broadcastListChange();
						});
					}
				}
			}
			
			//append in right order
			if (lItemLeft) lItem.appendChild(lItemLeft);
			lItem.appendChild(lItemCenter);
			if (lItemRight) lItem.appendChild(lItemRight);
			
			//center element is either menu button or has own action
			if (options && !options.itemMenu){
				//on build:
				if (options.itemActions && options.itemActions.centerOnBuild){
					options.itemActions.centerOnBuild(itemData, lItemCenter);
				}
				//on click:
				if (options.itemActions && options.itemActions.centerOnClick){
					$(lItemCenter).on('click', function(){
						options.itemActions.centerOnClick(itemData, lItemCenter);
						broadcastListChange();
					});
				}
			
			//menu??
			}else if (options && options.itemMenu && options.itemMenu.length > 0){
				var itemMenu = document.createElement('div');
				itemMenu.className = 'bytemind-cards-item-menu';
				itemMenu.style.display = 'none';
				
				for (var i=0; i<options.itemMenu.length; i++){
					var menuItem = makeItemMenu(options.itemMenu[i])
					itemMenu.appendChild(menuItem);
				}
				lItem.appendChild(itemMenu);
				
				//add button
				$(lItemCenter).on('click', function(){
					//$(itemMenu).toggleClass('bytemind-minimize-y');
					$(itemMenu).slideToggle(300);
				});
			}
			return lItem;
		}
		//make item menu
		function makeItemMenu(menuData){
			var menuItem = document.createElement('div');
			menuItem.className = 'bytemind-cards-item-menu-item';
			
			//pre-defined buttons with actions
			if (menuData.action){
				switch(menuData.action) {
					
					//edit item
					case 'editItem':
						menuItem.innerHTML = "<i class='material-icons bm-menu-small'>edit</i>";
						break;
						
					//share item
					case 'shareList':
						menuItem.innerHTML = "<i class='material-icons bm-menu-small'>share</i>";		//launch, reply
						break;
					
					//delete item
					case 'deleteItem':
						menuItem.innerHTML = "<i class='material-icons bm-menu-small'>delete</i>";		//clear, cancel
						$(menuItem).on('click', function(){
							$(this).closest('.bytemind-cards-item').remove();
							broadcastListChange();
						});
						break;
				}
			
			//custom buttons with functions
			}else if (menuData.fun){
				//use material icon
				if (menuData.materialIcon){
					menuItem.innerHTML = "<i class='material-icons bm-menu-small'>" + menuData.materialIcon + "</i>";
				}
			}

			return menuItem;
		}
	}
	
	return ItemList;
}