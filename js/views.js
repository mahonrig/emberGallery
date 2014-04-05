App.ApplicationView = Ember.View.extend({
  actions: {
    showNav: function(){
      if ($('nav').hasClass('visible')){
        $('nav').animate({left:-175},500);
        $('nav').removeClass('visible');
      } else {
        $('nav').animate({left:0},500);
        $('nav').addClass('visible');
      }
    }
  }
});

App.GalleriesView = Ember.View.extend({
    templateName: 'galleries',
    didInsertElement: function() {
        this.get('controller').send('showGalleries');
        $('title').text('All Galleries');
        var $prev = this.$('.galleryPreview');
        $prev.each(function(index){
          var pos = index * 250;
          var z = 100 - index;
          $(this).css('left', pos);
          $(this).css('z-index', z);
        });
    },
    actions: {

      /* slide in/out the photo sidebar */
      toggleAllPhotos: function(){
        if (!$('.availablePhotos').hasClass('visible')){
          $('.availablePhotos').animate({right:0},500);
          $('.availablePhotos').addClass('visible');
        } else {
          $('.availablePhotos').animate({right:-175},500);
          $('.availablePhotos').removeClass('visible');
        }

      }
    },
});

App.GalleryView = Ember.View.extend({
    templateName: 'gallery',
    didInsertElement: function() {
        var controller = this.get('controller');
        controller.send('hideGalleries');
        controller.send('showPhotos');
        $('title').text('Viewing Gallery - ' + controller.get('model.title'));
    }
});

App.PhotoView = Ember.View.extend({
    templateName: 'photo',
    didInsertElement: function() {
        var controller = this.get('controller');
        controller.send('hideGalleries');
        controller.send('hidePhotos');
        $('title').text(controller.get('model.title'));
    }
});

App.OrderView = Ember.View.extend({
    templateName: 'order',
    didInsertElement: function(){
        imagesLoaded( '.productLarge', function() {
            var $img = $('.largeImage');
            var imgWidth = $img.width();
            var imgHeight = $img.height();
            var windowWidth = $( window ).width();
            var windowHeight = $( window ).height();
            if (imgWidth >= imgHeight){
                $img.width(windowWidth * .9);
                if ($img.height() > windowHeight){
                    var factor = (windowHeight * .8) / $img.height();
                    $img.height($img.height() * factor);
                    $img.width($img.width() * factor);
                }
            } else {
                $img.height(windowHeight * .8);
            }
        });
    }
});

App.EditTitleTextView = Ember.TextField.extend({
    classNames: 'editTitle',
    didInsertElement: function() {
        /* Set input element slightly larger than the text */
        this.$().attr('size', this.$().val().length * 1.1);
        this.$().focus();
    },

    /* For some reason this doesn't save everytime, only usually (probably isDirty check) */
    focusOut: function(){
        this.get('parentView').set('titleEditing', false);
        this.get('parentView').get('controller').send('acceptTitleChange');
    },

  /* This triggers the focusOut event, which saves the model */
    insertNewline: function(evt){
        this.get('parentView').set('titleEditing', false);
    },

    /* Prevents links from being followed while in edit mode */
    click: function(evt){
        evt.preventDefault();
    },

    /* Enlarge input box as you type */
    keyPress: function(evt){
      this.$().attr('size', this.$().val().length * 1.1);
    },
});

/* Register our extended textfield as a helper */
Ember.Handlebars.helper('edit-title', App.EditTitleTextView);

App.EditTitleView = Ember.View.extend({
    templateName: 'editTitle',
    titleEditing: false,

    click: function(event){
      event.preventDefault();
    },

    actions: {
        /* Triggers inclusion of edit-title helper in template
         * could probably do more here, and remove logic from template */
        editTitle: function(){
            this.set('titleEditing', true);
        },
    }
});

/* .shadowBox is located on main page, outside of any views
 * will probably use it for multiple purposes in the future */
App.NewPhotosContainer = Ember.ContainerView.create();
App.NewPhotosContainer.appendTo('.shadowBox');

App.UploadPhotosView = Ember.View.extend({
      //  templateName: 'addPhotos',

        /* drag enter/over need to be set to prevent exploding
         * will add css effects here in future */
        dragEnter: function(event) {
            event.preventDefault();
        },

        dragOver: function(event) {
            event.preventDefault();
        },

        drop: function(event) {
            event.preventDefault();
            /* Loop through each dropped photo, create new view for the images */
            var files = event.dataTransfer.files;
            var count = 0;
            for (var i = 0; i < files.length; i++){
                //console.log(files[i]);
                if (files[i].type.match("image.*")) {
                  /* Push a new view representing our photo to the container within the shadowbox */
                  App.NewPhotosContainer.pushObject(App.NewPhotosView.create({
                    file: files[i],
                  }));
                  count++;
                }
            }
            if (count){
              /* shadow box should now hold the new photos, lets show it */
              $('.shadowBox').width($(window).width());
              $('.shadowBox').height($(window).height());
              $('.shadowBox').fadeIn();
            }
      },

        doubleClick: function(event){
          $('#uploadInput').click();

        }
});

/* Used for each of our new photos to submit
 * image source is set in the drop function on create */
App.NewPhotosView = Ember.View.extend({
    templateName: 'newPhotoDetails',
    title: 'Untitled', /* Default title */
    src: '', /* Image preview */
    /* file: is set upon create during drop event */
    /* For file preview, get the image data */
    setsrc: function(){
      var that = this;
      var reader = new FileReader();
      reader.readAsDataURL(this.get('file'));
      reader.onload = function(imgsrc){
        that.set('src', imgsrc.target.result);
      }
    }.observes('file').on('init'),

    actions: {

        /* fade out / remove photo, if lightbox is empty, fade it out */
        cancel: function(){
            var that = this;
            this.$().fadeOut(function(){
                App.NewPhotosContainer.removeObject(that);
                if ($('.shadowBox>.ember-view').html() == ''){
                    $('.shadowBox').fadeOut();
                }
            });


        },

        /* Upload photo to server, which resizes and saves
         * Should resize these photos to some max size or under
         * and then upload. Need to refresh model still */
        submit: function(){
          var that = this;
          var formData = new FormData();
          formData.append('file', this.get('file'));
          formData.append('title', this.get('title'));
          xhr = new XMLHttpRequest();
          xhr.open('POST', '/photos/new');

          /* Haven't checked to see if this works yet */
          xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
              var complete = (event.loaded / event.total * 100 | 0);
              that.$('progress').value = complete;
            }
          }

          xhr.onload = function() {
            //console.log(xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            console.log(response.id);
            App.Photo.store.push('photo', {
              id: response.id,
              title: response.title,
              largeFile: response.largeFile,
              mediumFile: response.mediumFile,
              smallFile: response.smallFile,
              thumbFile: response.thumbFile
            });
            /* Remove our view object, fade out shadow box if empty */
            App.NewPhotosContainer.removeObject(that);
            if ($('.shadowBox>.ember-view').html() == ''){
                $('.shadowBox').fadeOut();
            }

          }

          /* Send out our request */
          xhr.send(formData);

        }
    }

});

App.NewGalleryView = Ember.View.extend({
  templateName: 'newGallery',
  title: 'New Gallery',
  actions: {
    submit: function(){
      console.log('Submitted ' + this.get('title'));
      var that = this;
      var formData = new FormData();
      formData.append('title', this.get('title'));
      xhr = new XMLHttpRequest();
      xhr.open('POST', '/gallery/new');

      xhr.onload = function() {
        console.log('Success (maybe)');
        that.set('title', '');
        that.$('.added').fadeIn().delay(500).fadeOut();
      }

      /* Send out our request */
      xhr.send(formData);
    }
  }
});

App.DroppablePhotoView = Ember.View.extend({
  dragStart: function(event){
    event.dataTransfer.setData('photo_id',event.target.id);
    event.dataTransfer.setData('gallery_id', event.target.getAttribute('data-gallery'));
    $('.removePhoto').slideDown();
  },

  dragEnd: function(event){
    $('.removePhoto').slideUp();
  }

});

App.AddPhotoView = Ember.View.extend({
  dragEnter: function(event) {
      event.preventDefault();
  },

  dragOver: function(event) {
      event.preventDefault();
  },

  drop: function(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData('photo_id');
    this.get('controller').send('addPhoto', data);
  }
});

App.RemovePhotoView = Ember.View.extend({
  dragEnter: function(event) {
      event.preventDefault();
  },

  dragOver: function(event) {
      event.preventDefault();
  },

  drop: function(event) {
    event.preventDefault();
    var photo_id = event.dataTransfer.getData('photo_id');
    var gallery_id = event.dataTransfer.getData('gallery_id');
    if (gallery_id != 'null'){ /* dropped from gallery, remove it from the gallery */
      var data = {
        'photo_id': photo_id,
        'gallery_id': gallery_id
      };
      this.get('controller').send('removePhotoFromGallery', data);
    } else { /* Dropped from sidebar, delete photo */
      this.get('controller').send('removePhoto', photo_id);
    }
    $('.removePhoto').slideUp(); /* usually dragEnd handles this, but not if photo is removed */
  }
});
