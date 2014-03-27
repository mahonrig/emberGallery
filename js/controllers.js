/* Application controller, overall control of shopping cart here
 * CartItem is passed in the router */
Photoworks.ApplicationController = Ember.ArrayController.extend({

	/* Return total number of items in cart */
	totalItems: function(){
		return this.get('cartItem').get('length');
	}.property('cartItem.@each'),
	
	/* Return total price in cart */
	totalPrice: function(){
		var cartItems = this.get('cartItem');
		return cartItems.reduce(function(prevValue, item){
			return prevValue + item.get('price');
			}, 0);
	}.property('cartItem.@each.price'),
	
	/* Used for the paypal form, index the cart items */
	assignIndex: function(){
		this.get('cartItem').map(function(item, index){
            Ember.set(item, 'index', index+1);
        });
	}.observes('cartItem.[]', 'firstObject', 'lastObject'),
	
	/* Actions hash */
	actions: {
		
		/* Clear all items from the cart */
		clearCart: function(){
			var cartItems = this.get('cartItem');
			cartItems.forEach(function(item){
				item.deleteRecord();
				item.save();
			});
		},
		
        /* When clicking the 'View Cart' link */
		toggleCart: function(){
			$('.cart').fadeToggle();
		},
		
        /* Button within the cart div */
		hideCart: function(){
			$('.cart').fadeOut();
		},
        
        acceptTitleChange: function(){
            this.store.find('site', 1).then(function(site){
            if (site.get('isDirty')){
                site.save();
                console.log('Saved Site');
            }
            });
        }
	}
});

/* Controller for individual items in the cart */
Photoworks.CartItemController = Ember.ObjectController.extend({

	actions: {
		removeFromCart: function(id){
			this.store.find('cartItem', id).then(function(item){
				item.deleteRecord();
				item.save();
			});
		}
	},
    
	/* For paypal checkout form */
	paypalFormItem: function() {
		var index = this.get('index');
		return 'item_name_' + index;
	}.property('index'),
	
	paypalFormAmount: function() {
		var index = this.get('index');
		return 'amount_' + index;
	}.property('index'),
	
	paypalFormTitle: function() {
		var title = this.get('title');
		var type = this.get('type');
		var size = this.get('size');
		return title + ' ' + size + ' ' + type;
	}.property('title', 'type', 'size')
});

/* Controller for the large view ordering page */
Photoworks.OrderController = Ember.ObjectController.extend({
	actions: {
		addToCart: function() {
			var title = this.get('title');
			var type = this.get('type');
			var size = this.get('size');
			var price = this.get('price');
			if (price){
				var record = this.store.createRecord('cartItem', {
					title: title,
					type: type,
					size: size,
					price: price 
				});
				record.save();
				$('.added').fadeIn().delay(500).fadeOut();
				console.log('Added item: ' + title);
			} else {
				console.log('Please select a size');
				$('.errorSelect').fadeIn().delay(500).fadeOut();
			}
		},
        
        acceptTitleChange: function(){
                this.get('model').save();
        }
	},
    
    admin: window.admin,
	
	/* Available print types, convert to model and have on per photo basis */
	types: [
		{type: "Print Only", id: 1},
		{type: "Matted Print", id: 2},
		{type: "Framed Print", id: 3},
		{type: "Metal Print", id: 4}
	],
	
	/* Store id of current print type selected */
	currentType: 1,
	
	/* Store id of current size selected */
	currentSize: 1,
	
	/* filter options depending on type selected */
	currentOptions: function(){
		var type = this.get('currentType');
		switch (type){
			case 1:
				return this.get('orderOptions').filterProperty('type', 'Print');
				break;
			case 2: 
				return this.get('orderOptions').filterProperty('type', 'Matted');
				break;
			case 3:
				return this.get('orderOptions').filterProperty('type', 'Framed');
				break;
			case 4:
				return this.get('orderOptions').filterProperty('type', 'Metal');
				break;
			}
	}.property('orderOptions.@each.type', 'currentType'),
	
	/* Store current price for selected item */
	price: 0,
	
	/* Store current type for selected item. This is separate from types above
		and comes from the options model */
	type: '',
	
	/* Store currently selected print size */
	size: '',
	
	/* Updates price, type, and size from option model 
		observes for changes in the currently selected size */
	itemUpdate: function() {
		var that = this; /* Keep hold of our context */
		var currentSize = this.get('currentSize');
		/* If id is set, an option is selected */
		if (currentSize){
		/* Store returns a promise, use then() to wait for it to resolve */
		this.store.find('orderOption', currentSize).then(function(option){
			console.log(option.get('price'));
			console.log(option.get('type'));
			console.log(option.get('size'));
			that.set('price', option.get('price'));
			that.set('type', option.get('type'));
			that.set('size', option.get('size'));		
		});
		} else { /* Size option not set, clear everything */
			that.set('price', 0);
			that.set('type', '');
		}	that.set('size', '');
	}.observes('currentSize')
	
});

Photoworks.GalleryPreviewController = Ember.ObjectController.extend({
    admin: window.admin,
});

/*Photoworks.AdminController = Ember.ObjectController.extend({
    count: 0,
});*/