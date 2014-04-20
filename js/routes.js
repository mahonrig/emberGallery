/* Map our routes, resource used for noun, route used for verb */
App.Router.map(function() {
	this.resource('slideshow', {path: '/'}, function(){
		this.route('photo', {path: 'photo/:photo_id'});
	});
	this.resource('galleries', function(){
		this.route('photo', {path: 'photo/:photo_id'});
	});
  this.resource('gallery', { path: '/gallery/:gallery_id' }, function(){
		this.route('photo', {path: 'photo/:photo_id'});
	});
	this.resource('about');

    /* if admin is set we'll enable these routes
     * if someone enables this in js console, will error because TWIG
     * won't include necessary handlebars templates
     * Maybe we should just display an error message on each of these routes
     * if not logged in */
    if (window.admin){
        this.resource('admin', function(){
					this.route('photo', {path: 'photo/:photo_id'});
				});
    }
  	this.resource('printDetails'); /* Product details */
    this.resource('login');
});

/* Remove the # from url, app has to be served from all endpoints */
App.Router.reopen({
  location: 'history'
});

/* Currently only using this for the shopping cart, need to
 * convert to a view / component */
App.ApplicationRoute = Ember.Route.extend({
    /* sending cartItems to the application controller */
	setupController: function(controller, model){
    controller.set('site', this.store.find('site', 1));
		controller.set('cartItem', this.store.find('cartItem'));
		controller.set('admin', window.admin);
		controller.set('galleries', this.store.find('gallery'));
		controller.set('photos', this.store.find('photo'));
	},
	actions: {
		removePhoto: function(id){
			this.store.find('photo', id).then(function(photo){
				photo.deleteRecord();
				photo.save();
			});
		},

		saveSite: function(){
			this.store.find('site', 1).then(function(site){
				site.save();
			});
		},
	},
});

App.SlideshowRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('photo');
	}
});

App.AdminRoute = Ember.Route.extend({
    setupController: function(controller){
        controller.set('site', this.store.find('site', 1));
        controller.set('photos', this.store.find('photo'));
        controller.set('galleries', this.store.find('gallery'));
				controller.set('orderTypes', this.store.find('orderType'));
    }
});

/* Preview of all the galleries */
App.GalleriesRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('gallery');
	},
	setupController: function(controller, model){
		controller.set('model', model);
		controller.set('photos', this.store.find('photo'));
		controller.set('admin', window.admin);
		$('title').text('All Galleries');
	},
    /* These all get handled when actions bubble up from nested controllers */
    actions: {

        willTransition: function(transition) {
					/* Set if we're trying to edit a link */
						if (App.stop){
							transition.abort();
						}
        }
    },

});

App.GalleriesPhotoRoute = Ember.Route.extend({
	model: function(params){
		return this.store.find('photo', params.photo_id);
	},

	setupController: function(controller, model){
		controller.set('model', model);
		controller.set('site', this.store.find('site', 1));
		controller.set('availableTypes', this.store.find('orderType'));
	},
});

App.GalleryPhotoRoute = App.GalleriesPhotoRoute.extend();
App.SlideshowPhotoRoute = App.GalleriesPhotoRoute.extend();
App.AdminPhotoRoute = App.GalleriesPhotoRoute.extend();

/* Individual gallery route */
App.GalleryRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('gallery', params.gallery_id);
	},

  actions: {
         willTransition: function(transition) {
					//	console.log('Gallery Will transition ' + transition.targetName);
						if (App.stop){
							transition.abort();
						}
        }
    }
});

App.PhotoRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('photo', params.photo_id);
    },
		setupController: function(controller, model){
			controller.set('model', model);
			controller.set('site', this.store.find('site', 1));
			controller.set('availableTypes', this.store.find('orderType'));
		},
		actions: {
			willTransition: function(transition){
				//console.log('photo will transition ' + transition.targetName)
				if (App.stop){
					transition.abort();
				}
			}
		}
});
