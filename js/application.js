/*
ToDo:
	-Implement photo gallery
	-About me page

*/
/* Create the ember application registered to a global variable */
window.Photoworks = Ember.Application.create();

/* Using local storage fixture adapter for now, change to RESTful */
Photoworks.PhotosAdapter = DS.FixtureAdapter.extend();
Photoworks.OptionsAdapter = DS.FixtureAdapter.extend();
Photoworks.CartItemSerializer = DS.LSSerializer.extend();
Photoworks.CartItemAdapter = DS.LSAdapter.extend({
	namespace: 'photoworks'
});

/* Map our routes, resource used for noun, route used for verb */
Photoworks.Router.map(function() {
  	this.resource('prints'); /* Thumbnails page */
  	this.resource('order', { path: '/order/:photo_id' }); /* Print large view and ordering */
  	this.resource('printDetails'); /* Product details */
});

/* Route for large display of selected print and ordering options */  	
Photoworks.OrderRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('photos', params.photo_id);
  }
});

/* Route for the available prints thumbnail gallery */
Photoworks.PrintsRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('photos');
	}	
});

/* Currently only using this for the shopping cart, need to
	convert to a view / more specific controller I think */
Photoworks.ApplicationRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('cartItem');
	}
	
});

/* Application controller*/
Photoworks.ApplicationController = Ember.ArrayController.extend({

	/* Return total number of items in cart */
	totalItems: function(){
		return this.get('length');
	}.property('@each'),
	
	/* Return total price in cart */
	totalPrice: function(){
		var cartItems = this.get('model');
		return cartItems.reduce(function(prevValue, item){
			console.log(item.get('price'));
			return prevValue + item.get('price');
			}, 0);
	}.property('@each.cartItem.price'),
	
	/* Used for the paypal form, index the cart items */
	assignIndex: function(){
		this.map(function(item, index){
			Ember.set(item, 'index', index+1);
		});
	}.observes('cartItem.[]', 'firstObject', 'lastObject'),
	
	/* Actions hash */
	actions: {
		
		/* Clear all items from the cart */
		clearCart: function(){
			var cartItems = this.get('model');
			cartItems.forEach(function(item){
				item.deleteRecord();
				item.save();
			});
		},
		
		toggleCart: function(){
			$('.cart').fadeToggle();
		},
		
		hideCart: function(){
			$('.cart').fadeOut();
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

/* Controller for individual thumbnails on the prints page */
Photoworks.ThumbController = Ember.ObjectController.extend({
	/* Return thumbnail, probably don't want this hardcoded */
	url: function(){
		var img = this.get('img');
		return "http://mgibsonphotoworks.com/uploads/thumbs/" + img ;
	}.property('img')
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
		}
	},
	
	/* Available print types, maybe should convert to model instead of hardcoding */
	types: [
		{type: "Print Only", id: 1},
		{type: "Matted Print", id: 2},
		{type: "Framed Print", id: 3},
		{type: "Metal Print", id: 4}
	],
	
	/* Store id of current print type selected */
	currentType: {
		id: 1
	},
	
	/* Store id of current size selected */
	currentSize: {
		id: 1
	},
	
	/* Return large image, need to not hardcode this */
	url: function(){
		var img = this.get('img');
		return "http://mgibsonphotoworks.com/uploads/large/" + img ;
	}.property('img'),
	
	/* The following are needed to keep logic out of the template, annoying */
	printSelected: function(){
		if (this.get('currentType.id') == 1) return true;
		else return false;
	}.property('currentType.id'),
	
	mattSelected: function(){
		if (this.get('currentType.id') == 2) return true;
		else return false;
	}.property('currentType.id'),
	
	frameSelected: function(){
		if (this.get('currentType.id') == 3) return true;
		else return false;
	}.property('currentType.id'),
	
	metalSelected: function(){
		if (this.get('currentType.id') == 4) return true;
		else return false;
	}.property('currentType.id'),
	/* End annoying replacements for a simple switch statement */
	
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
		that = this; /* Keep hold of our context */
		id = this.get('currentSize.id');
		/* If id is set, an option is selected */
		if (id){
		/* Store returns a promise, use then() to wait for it to resolve */
		this.store.find('options', id).then(function(option){
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
	}.observes('currentSize.id')
	
});

/* Model for our photos */
Photoworks.Photos = DS.Model.extend({
	title: DS.attr('string'),
	img: DS.attr('string'),
	printSizes: DS.hasMany('options', { async: true }),
	mattSizes: DS.hasMany('options', { async: true }),
	frameSizes: DS.hasMany('options', { async: true }),
	metalSizes: DS.hasMany('options', { async: true })
});

/* Model for available print, matt, frame, and metal options */
Photoworks.Options = DS.Model.extend({
	type: DS.attr('string'),
	size: DS.attr('string'),
	price: DS.attr('number'),
	/* To show price in select drop-down */
	display: function(){
		var displayed = this.get('size') + ': $' + this.get('price');
		return displayed;
	}.property('size', 'price')
});

/* Model for our shopping cart items */
Photoworks.CartItem = DS.Model.extend({
	title: DS.attr('string'),
	type: DS.attr('string'),
	size: DS.attr('string'),
	price: DS.attr('number')
});

/* Temp fixtures for testing */
/*Photoworks.CartItem.FIXTURES = [
	{
	id: 1,
	title: "Pacific Northwest Rainforest",
	type: "Framed",
	size: "8x10 in 11x14",
	price: 50
	},
	{
	id: 2,
	title: "Mount Shuksan at Sunset",
	type: "Matt",
	size: "11x14 on 16x20",
	price: 100
	}
];*/

/* Available options */
Photoworks.Options.FIXTURES = [
	{
		id: 1,
		type: 'Print',
		size: '8x12',
		price: 50
	},
	{
		id: 2,
		type: 'Print',
		size: '12x18',
		price: 75
	},
	{
		id: 3,
		type: 'Print',
		size: '16x24',
		price: 100
	},
	{
		id: 4,
		type: 'Print',
		size: '20x30',
		price: 125
	},
	{
		id: 5,
		type: 'Print',
		size: '8"x10"',
		price: 50
	},
	{
		id: 6,
		type: 'Print',
		size: '11x14',
		price: 75
	},
	{
		id: 7,
		type: 'Print',
		size: '16x20',
		price: 100
	},
	{
		id: 8,
		type: 'Print',
		size: '20x24',
		price: 125
	},
	{
		id: 9,
		type: 'Matted',
		size: '8x12 on 11x14',
		price: 75
	},
	{
		id: 10,
		type: 'Matted',
		size: '11x16 on 16x20',
		price: 100
	},
	{
		id: 11,
		type: 'Matted',
		size: '12x18 on 24x30',
		price: 125
	},
	{
		id: 12,
		type: 'Matted',
		size: '8x10 on 11x14',
		price: 75
	},
	{
		id: 13,
		type: 'Matted',
		size: '11x14 on 16x20',
		price: 100
	},
	{
		id: 14,
		type: 'Matted',
		size: '16x20 on 20x24',
		price: 125
	},
	{
		id: 15,
		type: 'Framed',
		size: '8x12 in 11x14',
		price: 125
	},
	{
		id: 16,
		type: 'Framed',
		size: '11x16 in 16x20',
		price: 175
	},
	{
		id: 17,
		type: 'Framed',
		size: '14x20 in 24x30',
		price: 225
	},
	{
		id: 18,
		type: 'Metal',
		size: '8x12',
		price: 100
	},
	{
		id: 19,
		type: 'Metal',
		size: '12x18',
		price: 150
	},
	{
		id: 20,
		type: 'Metal',
		size: '16x24',
		price: 200
	},
	{
		id: 21,
		type: 'Metal',
		size: '20x30',
		price: 250
	},
	{
		id: 22,
		type: 'Print',
		size: '10x10',
		price: 50
	},
	{
		id: 23,
		type: 'Print',
		size: '16x16',
		price: 75
	},
	{
		id: 24,
		type: 'Print',
		size: '20x20',
		price: 100
	},
	{
		id: 25,
		type: 'Matted',
		size: '10x10 on 12x12',
		price: 75
	},
	{
		id: 26,
		type: 'Framed',
		size: '10x10 in 12x12',
		price: 125
	},
	{
		id: 27,
		type: 'Framed',
		size: '16x16 in 20x20',
		price: 200
	},
	{
		id: 28,
		type: 'Metal',
		size: '10x10',
		price: 100
	},
	{
		id: 29,
		type: 'Metal',
		size: '16x16',
		price: 150
	},
	{
		id: 30,
		type: 'Metal',
		size: '24x24',
		price: 250
	},
	{
		id: 31,
		type: 'Metal',
		size: '12x36',
		price: 250
	},
	{
		id: 32,
		type: 'Metal',
		size: '20x60',
		price: 500
	},
	{
		id: 33,
		type: 'Framed',
		size: '12x36',
		price: 200
	},
	{
		id: 34,
		type: 'Print',
		size: '12x36',
		price: 100
	},
	{
		id: 35,
		type: 'Print',
		size: '16x48',
		price: 150
	},
	{
		id: 36,
		type: 'Print',
		size: '20x60',
		price: 200
	},
];

/* Current photos in gallery */ 
Photoworks.Photos.FIXTURES = [
 	{
 	id: 1,
 	title: 'Pacific Northwest Rainforest',
 	img: 'IMG_1124%20-%20IMG_1125.jpg',
 	printSizes: [22, 23, 24],
 	mattSizes: [25],
 	frameSizes: [26, 27],
 	metalSizes: [28, 29, 30] 
 	},
 	{
 	id: 2,
 	title: 'Mt Shuksan',
 	img: 'IMG_0908%20-%20IMG_0910-Edit.jpg',
 	printSizes: [34, 35, 36],
 	mattSizes: [],
 	frameSizes: [33],
 	metalSizes: [31, 32]
 	},
 	{
 	id: 3,
 	title: 'Above the snowline',
 	img: 'IMG_1106%20-%20IMG_1111.jpg',
 	printSizes: [1, 3],
 	mattSizes: [1,2],
 	frameSizes: [2,3],
 	metalSizes: [3]
 	},
 	{
 	id: 4,
 	title: 'Mt Index and Lake Serene',
 	img: 'IMG_1082%20-%20IMG_1093-Edit.jpg',
 	printSizes: [1, 3],
 	mattSizes: [1,2],
 	frameSizes: [2,3],
 	metalSizes: [3]
 	},
 	{
 	id: 5,
 	title: 'Nooksack Falls',
 	img: 'IMG_0994%20-%20IMG_0997.jpg',
 	printSizes: [1, 3],
 	mattSizes: [1,2],
 	frameSizes: [2,3],
 	metalSizes: [3]
 	},
 	{
 	id: 6,
 	title: 'Snowfields at Mount Baker',
 	img: 'IMG_0926.jpg',
 	printSizes: [1, 3],
 	mattSizes: [1,2],
 	frameSizes: [2,3],
 	metalSizes: [3]
 	}
 ];
 	