/* Application controller, overall control of shopping cart here
 * CartItem is passed in the router */
App.ApplicationController = Ember.ArrayController.extend({

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

  admin: window.admin,

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
    },

    showGalleryLinks: function(){
      $('.galleries').fadeToggle();
    },

	}
});

App.SlideshowController = Ember.ArrayController.extend({
  actions: {
    goToNextPhoto: function(){
      var length = this.get('model.length');
      index = this.get('index');
      var that = this;
      $('.currentPhoto').fadeOut(function(){
        if (index < (length - 1)){
          index++;
          that.set('index', index);
        } else {
          that.set('index', 0);
        }
        $(this).fadeIn();
      });

    },

    goToPrevPhoto: function(){
      var length = this.get('model.length');
      index = this.get('index');
      var that = this;
      $('.currentPhoto').fadeOut(function(){
        if (index > 0){
          index--;
          that.set('index', index);
        } else {
          index = length - 1;
          that.set('index', index);
        }
        $(this).fadeIn();
      });
    },
  },

  index: 0,
  currentPhoto: function(){
    var photos = this.get('model');
    var length = photos.get('length');
    return photos.objectAt(this.get('index'));
  }.property('model.[]', 'index'),
  prevPhoto: function(){
    var photos = this.get('model');
    index = this.get('index');
    length = photos.get('length');

    if (!index){
      return photos.objectAt(length - 1);
    } else {
      return photos.objectAt(index - 1);
    }
  }.property('model.[]', 'index'),
  nextPhoto: function(){
    var photos = this.get('model');
    index = this.get('index');
    length = photos.get('length');

    if (index < (length - 2)){
      return photos.objectAt(index + 1);
    } else if (index >= (length - 2)) {
      return photos.objectAt(0);
    }
  }.property('model.[]', 'index'),


});
/* Controller for individual items in the cart */
App.CartItemController = Ember.ObjectController.extend({

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

App.GalleryPreviewController = Ember.ObjectController.extend({
    admin: window.admin,
    actions: {
      addPhoto: function(id){
        var that = this;
        this.store.find('photo', id).then(function(photo){
          var photos = that.get('photos');
          if (!photos.contains(photo)){
            console.log('Adding Photo ' + id + ' to ' + that.get('id'));
            photos.pushObject(photo);
            that.get('model').save();
          }
        });
      },

      acceptTitleChange: function(){
        console.log('Accepting');
        this.get('model').save();
      },

      deleteGallery: function(){
        App.deletedGallery = true;
        var gallery = this.get('model');
        gallery.deleteRecord();
        gallery.save();
      }
    }
});

App.EachGalleryController = Ember.ObjectController.extend({
  admin: window.admin,
  actions: {
    acceptTitleChange: function(){
      console.log('Accepting');
      this.get('model').save();
    },
    deleteGallery: function(){
      App.deletedGallery = true;
      var gallery = this.get('model');
      gallery.deleteRecord();
      gallery.save();
    }
  }
});

App.GalleriesController = Ember.ArrayController.extend({
  actions: {
    removePhotoFromGallery: function(data){
      var that = this;
      console.log('Removing photo: ' + data.photo_id + ' from gallery: ' + data.gallery_id);
      this.store.find('photo', data.photo_id).then(function(photo){
        that.store.find('gallery', data.gallery_id).then(function(gallery){
          gallery.get('photos').removeObject(photo);
          gallery.save();
        });
      });
    },

    showPhotoShadowBox: function(){
      $('.photoShadowBox').width($(window).width());
      $('.photoShadowBox').height($(window).height());
      $('.photoShadowBox').fadeIn();
      console.log('showed shadow box');
    },
  },
});

App.GalleriesPhotoController = Ember.ObjectController.extend({
  actions: {
    addToCart: function() {
      var title = this.get('title');
      var type = this.get('currentType.type');
      var size = this.get('currentOption.size');
      var price = this.get('currentOption.price');
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
    },

    addNewOrderOption: function(){
      console.log('Adding option');
      var that = this;
      var model = this.get('model')
      model.get('orderTypes').pushObject(this.get('newType'));
      model.get('orderOptions').pushObject(this.get('newOption'));
      model.save();
    },

    back: function(){
      this.transitionToRoute('galleries');
    }
  },

    admin: window.admin,

  /* Available print types, convert to model and have on per photo basis */

  /* Store id of current print type selected */
  currentType: 0,
  /* Store id of current size selected */
  currentOption: 0,

  newType: '',
  newOption: '',

  /* filter options depending on type selected */
  currentOptions: function(){
    var type = this.get('currentType');
    if (type){
      var options = this.get('orderOptions').filterProperty('type', type);
    } else {
      var options = 0;
    }
    return options;
  }.property('orderOptions.@each.type', 'currentType'),

  currentPhoto: function(){
    return this.get('model');
  }.property('model'),

});
App.GalleryPhotoController = App.GalleriesPhotoController.extend({
  actions: {
    back: function(){
      this.transitionToRoute('gallery');
    }
  }
});
App.SlideshowPhotoController = App.GalleriesPhotoController.extend({
  actions: {
    back: function(){
      this.transitionToRoute('/');
    }
  }
});

App.AdminPhotoController = App.GalleriesPhotoController.extend({
  actions: {
    back: function(){
      this.transitionToRoute('/admin');
    }
  }
});

App.AdminController = Ember.ArrayController.extend({
  actions: {
    submitNewOrderType: function(){
      var record = this.store.createRecord('orderType', {
        type: this.get('newOrderType'),
      });
      record.save();
      this.set('newOrderType', '');
    },

    updateOrderType: function(id){
      this.store.find('orderType', id).then(function(type){
          type.save();
          console.log('Saving order Type');
      });
    },

    deleteOrderType: function(id){
      this.store.find('orderType', id).then(function(type){
          type.deleteRecord();
          type.save();
          console.log('Deleting order Type');
      });
    },
  },

  newOrderType: '',


});

App.OrderController = Ember.ObjectController.extend({
  actions: {
    createOrderOption: function(type_id){
      var that = this;
      this.store.find('orderType', type_id).then(function(orderType){
        var newOption = that.store.createRecord('orderOption', {
          type: orderType,
          size: that.get('newOrderSize'),
          price: that.get('newOrderPrice')
        });
        newOption.save().then(function(option){
          console.log(option.get('size'));
          orderType.get('options').pushObject(option);
        });
      });
    },

    deleteOrderOption: function(id){
      var that = this;
      this.store.find('orderOption', id).then(function(option){
        option.on('didDelete', this, function(){
          console.log('Reloading');
          that.get('model').reload();
        });
        option.deleteRecord();
        option.save()
      });

    },
  },

  newOrderSize: '',
  newOrderPrice: 0,
});
