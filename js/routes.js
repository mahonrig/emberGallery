/* Map our routes, resource used for noun, route used for verb */
Photoworks.Router.map(function() {
	this.resource('galleries', function(){
        this.resource('gallery', { path: '/:gallery_id' }, function(){
            this.resource('photo', { path: '/photo/:photo_id' });
        });
    });
    
    /* if admin is set we'll enable these routes
     * if someone enables this in js console, will error because TWIG
     * won't include necessary handlebars templates
     * Maybe we should just display an error message on each of these routes
     * if not logged in */
    if (window.admin){
        this.resource('admin');
    }
   
  	this.resource('prints'); /* Thumbnails page */
  	this.resource('order', { path: '/order/:photo_id' }); /* Print large view and ordering */
  	this.resource('printDetails'); /* Product details */
    this.resource('login');
});

/* Remove the # from url, app has to be served from all endpoints */
Photoworks.Router.reopen({
  location: 'history'
});

/* Currently only using this for the shopping cart, need to
 * convert to a view / component */
Photoworks.ApplicationRoute = Ember.Route.extend({
    /* sending cartItems to the application controller */
	setupController: function(controller, model){
        controller.set('site', this.store.find('site', 1));
		controller.set('cartItem', this.store.find('cartItem'));
	}
});

Photoworks.AdminRoute = Ember.Route.extend({
    setupController: function(controller){
        controller.set('site', this.store.find('site', 1));
        controller.set('photos', this.store.find('photo'));
        controller.set('galleries', this.store.find('gallery'));
    }
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
    /* These all get handled when actions bubble up from nested controllers */
    actions: {
        /* Hide the galleries preview */
        hideGalleries: function(id){
            $('.galleriesMain').slideUp();
        },
        
        /* Reshow photos on gallery page */
        showPhotos: function(){
            $('.allPhotos').fadeIn();
        },
        
        /* Hide other photos when on individual page */
        hidePhotos: function(){
            $('.allPhotos').fadeOut();
        },
        
        /* Reshow the galleries preview */
        showGalleries: function(){
            $('.galleriesMain').slideDown();
        },
        willTransition: function(transition) {
            if (transition.targetName == 'galleries.index')
                this.controller.send('showGalleries');
        }
    },
    
});

/* Individual gallery route */
Photoworks.GalleryRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('gallery', params.gallery_id);
	},
    actions: {
         willTransition: function(transition) {
            if (transition.targetName == 'gallery.index')
                this.controller.send('showPhotos');
            if (transition.targetName == 'galleries.index')
                this.controller.send('showGalleries');
        }
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
