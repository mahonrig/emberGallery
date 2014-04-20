/* Contain site information - not used yet */
App.Site = DS.Model.extend({
	title: DS.attr('string'),
	bannerImg: DS.belongsTo('photo'),
  email: DS.attr('string'),
  facebook: DS.attr('string'),
  twitter: DS.attr('string'),
  tumblr: DS.attr('string'),
  pinterest: DS.attr('string'),
  paypal: DS.attr('string'),
  admin: DS.attr('number')
});

/* Individual Galleries */
App.Gallery = DS.Model.extend({
	title: DS.attr('string',{defaultValue: 'New Gallery'}),
	description: DS.attr('string',{defaultValue: 'Description'}),
	photos: DS.hasMany('photo', { async: true })
});

/* For about me, contact, print details, etc...*/
App.Page = DS.Model.extend({
	title: DS.attr('string',{defaultValue: 'New Page'}),
	description: DS.attr('string',{defaultValue: 'Description'}),
	contents: DS.hasMany('block')
});

/* Pages will be built up out of blocks */
App.Block = DS.Model.extend({
    type: DS.attr('string'), /* what type of content is in this block?*/
    content: DS.attr('string'),
    page: DS.belongsTo('page')
});

/* Model for our photos */
App.Photo = DS.Model.extend({
	title: DS.attr('string',{defaultValue: 'New Photo'}),
	caption: DS.attr('string',{defaultValue: 'Description'}),
	xlargeFile: DS.attr('string'),
  largeFile: DS.attr('string'),
  mediumFile: DS.attr('string'),
  smallFile: DS.attr('string'),
  thumbFile: DS.attr('string'),
	orderTypes: DS.hasMany('orderType', { async: true }),
	orderOptions: DS.hasMany('orderOption', { async: true }),
	fileLarge: function(){
		var w = $(window).width();
		if (w > 1024){
			return this.get('xlargeFile');
		} else if (w > 768){
			return this.get('largeFile');
		} else if (w > 512){
			return this.get('mediumFile');
		} else if (w > 256){
			return this.get('smallFile');
		} else {
			return this.get('thumbFile');
		}

	}.property('xlargeFile', 'largeFile', 'mediumFile', 'smallFile', 'thumbFile'),

	fileMedium: function(){
		var w = $(window).width();
		if (w > 1024){
			return this.get('largeFile');
		} else if (w > 768){
			return this.get('mediumFile');
		} else if (w > 512){
			return this.get('smallFile');
		} else {
			return this.get('thumbFile');
		}

	}.property('largeFile', 'mediumFile', 'smallFile', 'thumbFile'),

	fileSmall: function(){
		var w = $(window).width();
		if (w > 1024){
			return this.get('mediumFile');
		} else if (w > 768){
			return this.get('smallFile');
		} else {
			return this.get('thumbFile');
		}

	}.property('mediumFile', 'smallFile', 'thumbFile'),

	fileThumb: function(){
		return this.get('thumbFile');
	}.property('thumbFile'),

});

/* What order types are available for each photo */
App.OrderType = DS.Model.extend({
	type: DS.attr('string'),
	options: DS.hasMany('orderOption', {async: true})
});

/* Model for available print, matt, frame, and metal options */
App.OrderOption = DS.Model.extend({
	type: DS.belongsTo('orderType'),
	size: DS.attr('string'),
	price: DS.attr('number'),
	/* To show price in select drop-down */
	display: function(){
		var displayed = this.get('size') + ': $' + this.get('price');
		return displayed;
	}.property('size', 'price')
});

/* Model for our shopping cart items */
App.CartItem = DS.Model.extend({
	title: DS.attr('string'),
	type: DS.attr('string'),
	size: DS.attr('string'),
	price: DS.attr('number')
});
