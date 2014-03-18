/* Map our routes, resource used for noun, route used for verb */
Photoworks.Router.map(function() {
	this.resource('galleries', function(){
        this.resource('gallery', { path: '/:gallery_id' }, function(){
            this.resource('photo', { path: '/photo/:photo_id' });
        });
    });
   
  	this.resource('prints'); /* Thumbnails page */
  	this.resource('order', { path: '/order/:photo_id' }); /* Print large view and ordering */
  	this.resource('printDetails'); /* Product details */
});


/* Remove the # from url, app has to be served from all endpoints */
Photoworks.Router.reopen({
  location: 'history'
});

/* Route for large display of selected print and ordering options */  	
Photoworks.OrderRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('photo', params.photo_id);
  },
	setupController: function(controller, model){
		controller.set('model', model);
		$('title').text('Order a Print - ' + model.get('title'));
	}
});

/* Preview of all the galleries */
Photoworks.GalleriesRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('gallery');
	},
	setupController: function(controller, model){
		controller.set('model', model);
		$('title').text('All Galleries');
	},
    actions: {
        /* Hide the galleries preview */
        slideUp: function(id){
            $('.galleriesMain').slideUp();
        },
        
        showPhotos: function(){
            $('.allPhotos').fadeIn();
        },
        
        hidePhotos: function(){
            $('.allPhotos').fadeOut();
        },
        showGalleries: function(){
            $('.galleriesMain').slideDown();
        },
    }
});

/* Individual gallery route */
Photoworks.GalleryRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('gallery', params.gallery_id);
	}
});

Photoworks.PhotoRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('photo', params.photo_id);
    }
});

/* Route for the available prints thumbnail gallery */
Photoworks.PrintsRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('photo');
	},
	setupController: function(controller, model){
		controller.set('model', model);
		$('title').text('Available Prints');
	}	
});

/* Currently only using this for the shopping cart, need to
 * convert to a view / more specific controller I think */
Photoworks.ApplicationRoute = Ember.Route.extend({
	/*model: function() {
		return this.store.find('site');
	}*/
    /* sending cartItems to the application controller */
	setupController: function(controller){
		controller.set('cartItem', this.store.find('cartItem'));
	}
});