/*
ToDo:
	-Implement photo gallery
	-About me page
	- Filter print gallery by type?
	-Update print details page with pictures
	- ADMIN options - add photos, galleries, pages, etc...
	-RESTful API
*/

/* Need to get these url's from database */
function largeImg(file){
    return "http://mgibsonphotoworks.com/uploads/large/" + file;
}

function thumbImg(file){
    return "http://mgibsonphotoworks.com/uploads/thumbs/" + file;
}

/* Create the ember application registered to a global variable */
window.Photoworks = Ember.Application.create();

/* Using fixture adapter for now, change to RESTful */
Photoworks.ApplicationAdapter = DS.FixtureAdapter.extend();

/* Local storage for the shopping cart */
Photoworks.CartItemSerializer = DS.LSSerializer.extend();
Photoworks.CartItemAdapter = DS.LSAdapter.extend({
	namespace: 'photoworks'
});

/* Pulling galleries from our REST API*/
Photoworks.GalleryAdapter = DS.RESTAdapter.extend();






 	