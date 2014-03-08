/* Contain site information - not used yet */
Photoworks.Site = DS.Model.extend({
	title: DS.attr('string'),
	galleries: DS.hasMany('gallery', { async: true }),
	pages: DS.hasMany('page', { async: true })
});

/* Individual Galleries */
Photoworks.Gallery = DS.Model.extend({
	title: DS.attr('string'),
	description: DS.attr('string'),
	photos: DS.hasMany('photo', { async: true })
});

/* For about me, contact, print details, etc...*/
Photoworks.Page = DS.Model.extend({
	title: DS.attr('string'),
	description: DS.attr('string'),
	content: DS.attr('string')
});

/* Model for our photos */
Photoworks.Photo = DS.Model.extend({
	title: DS.attr('string'),
	caption: DS.attr('string'),
	file: DS.attr('string'),
    largeFile: DS.attr('string'),
    mediumFile: DS.attr('string'),
    smallFile: DS.attr('string'),
    thumbFile: DS.attr('string'),
	orderTypes: DS.hasMany('orderTypes', { async: true }),
	orderOptions: DS.hasMany('orderOptions', { async: true }),
});

/* What order types are available for each photo */
Photoworks.OrderTypes = DS.Model.extend({
	type: DS.attr('string')
});

/* Model for available print, matt, frame, and metal options */
Photoworks.OrderOptions = DS.Model.extend({
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

/* Available options */
Photoworks.OrderOptions.FIXTURES = [
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

/* Current photos in gallery */ 
Photoworks.Photo.FIXTURES = [
 	{
 	id: 1,
 	title: 'Pacific Northwest Rainforest',
 	file: 'IMG_1124%20-%20IMG_1125.jpg',
 	orderOptions: [22, 23, 24, 25, 26, 27, 28, 29, 30],
 	},
 	{
 	id: 2,
 	title: 'Mt Shuksan',
 	file: 'IMG_0908%20-%20IMG_0910-Edit.jpg',
 	orderOptions: [34, 35, 36, 33, 31, 32],
 	},
 	{
 	id: 3,
 	title: 'Above the snowline',
 	file: 'IMG_1106%20-%20IMG_1111.jpg',
 	orderOptions: [34, 35, 36, 33, 31, 32],
 	},
 	{
 	id: 4,
 	title: 'Mt Index and Lake Serene',
 	file: 'IMG_1082%20-%20IMG_1093-Edit.jpg',
 	orderOptions: [37, 38, 39, 40],
 	},
 	{
 	id: 5,
 	title: 'Nooksack Falls',
 	file: 'IMG_0994%20-%20IMG_0997.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 6,
 	title: 'Snowfields at Mount Baker',
 	file: 'IMG_0926.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 7,
 	title: 'Barbed Stars',
 	file: 'IMG_7045.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 8,
 	title: 'Sunrise over the Hindu Kush',
 	file: 'IMG_8662.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 9,
 	title: 'Afghani Terraces',
 	file: 'IMG_8761.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 10,
 	title: 'Afghani Village',
 	file: 'IMG_8996.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 11,
 	title: 'Welsh Surfers',
 	file: 'IMG_1066.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 12,
 	title: 'Edinburgh Castle',
 	file: 'IMG_4062.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 13,
 	title: 'Sedona Sky',
 	file: 'IMG_4386-2.jpg',
 	orderOptions: [43, 44, 45, 46, 41, 42],
 	},
 	{
 	id: 14,
 	title: 'Crater Lake',
 	file: 'IMG_9941-IMG_9945.jpg',
 	orderOptions: [34, 35, 36, 33, 31, 32],
 	},
 	{
 	id: 15,
 	title: 'McKenzie River Falls',
 	file: 'IMG_0374.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 16,
 	title: 'After the Storm',
 	file: 'IMG_0612.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 17,
 	title: 'Mogollon Rim',
 	file: 'IMG_3451.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 18,
 	title: 'Firelit Trees and Stars',
 	file: 'IMG_3176.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 19,
 	title: 'Moonlit Mt. Hood',
 	file: 'IMG_3884.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 20,
 	title: 'Crashing Surf',
 	file: 'IMG_5634.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 21,
 	title: 'Big and Small',
 	file: 'IMG_7470.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 22,
 	title: 'Gaff-Rigged Sky',
 	file: 'IMG_7471.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 23,
 	title: 'Olympic Tugboat',
 	file: 'IMG_0135.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 24,
 	title: 'Mossy Path',
 	file: 'IMG_0208%20-%20IMG_0211.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 25,
 	title: 'Snowed in Bus',
 	file: 'IMG_0425-Edit.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 26,
 	title: 'Stream from Baker Hot Springs',
 	file: 'IMG_0584%20-%20IMG_0588.jpg',
 	orderOptions: [43, 44, 45, 46, 41, 42],
 	},
 	{
 	id: 27,
 	title: 'Edinburgh Castle and Fountain',
 	file: 'IMG_3990.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 	{
 	id: 28,
 	title: 'Glowing Tent',
 	file: 'IMG_9895.jpg',
 	orderOptions: [1, 2, 3, 4, 9, 10, 11, 15, 16, 17, 18, 19, 20, 21],
 	},
 ];