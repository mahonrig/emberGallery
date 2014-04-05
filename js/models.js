/* Contain site information - not used yet */
App.Site = DS.Model.extend({
	title: DS.attr('string'),
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
	file: DS.attr('string'),
    largeFile: DS.attr('string'),
    mediumFile: DS.attr('string'),
    smallFile: DS.attr('string'),
    thumbFile: DS.attr('string'),
	orderTypes: DS.hasMany('orderType', { async: true }),
	orderOptions: DS.hasMany('orderOption', { async: true }),
});

/* What order types are available for each photo */
App.OrderType = DS.Model.extend({
	type: DS.attr('string')
});

/* Model for available print, matt, frame, and metal options */
App.OrderOption = DS.Model.extend({
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
App.CartItem = DS.Model.extend({
	title: DS.attr('string'),
	type: DS.attr('string'),
	size: DS.attr('string'),
	price: DS.attr('number')
});

/* Available options */
App.OrderOption.FIXTURES = [
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
	{
		id: 37,
		type: 'Print',
		size: '12x20',
		price: 75
	},
	{
		id: 38,
		type: 'Matted',
		size: '18x30 on 24x36',
		price: 150
	},
	{
		id: 39,
		type: 'Framed',
		size: '18x30 in 24x36',
		price: 300
	},
	{
		id: 40,
		type: 'Metal',
		size: '16x30',
		price: 200
	},
	{
		id: 41,
		type: 'Metal',
		size: '10x20',
		price: 100
	},
	{
		id: 42,
		type: 'Metal',
		size: '12x24',
		price: 150
	},
	{
		id: 43,
		type: 'Print',
		size: '12x24',
		price: 75
	},
	{
		id: 44,
		type: 'Print',
		size: '20x40',
		price: 150
	},
	{
		id: 45,
		type: 'Matt',
		size: '12x24 on 24x36',
		price: 150
	},
	{
		id: 46,
		type: 'Framed',
		size: '12x24',
		price: 200
	},
	
];

