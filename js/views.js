Photoworks.GalleriesView = Ember.View.extend({
    templateName: 'galleries',
    didInsertElement: function() {
        this.get('controller').send('showGalleries');
        $('title').text('All Galleries');
    }
});

Photoworks.GalleryView = Ember.View.extend({
    templateName: 'gallery',
    didInsertElement: function() {
        var controller = this.get('controller');
        controller.send('hideGalleries');
        controller.send('showPhotos');
        $('title').text('Viewing Gallery - ' + controller.get('model.title'));
    }
});

Photoworks.PhotoView = Ember.View.extend({
    templateName: 'photo',
    didInsertElement: function() {
        var controller = this.get('controller');
        controller.send('hideGalleries');
        controller.send('hidePhotos');
        $('title').text(controller.get('model.title'));
    }
});

Photoworks.OrderView = Ember.View.extend({
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

Photoworks.EditTitleTextView = Ember.TextField.extend({
    didInsertElement: function() {
        /* Set input element slightly larger than the text */
        this.$().attr('size', this.$().val().length * 1.1);
        this.$().focus();
    },

    /* For some reason this doesn't save everytime, only usually */
    focusOut: function(){
        this.get('parentView').set('titleEditing', false);
        this.get('parentView').send('acceptTitleChange');
    },

    insertNewline: function(evt){
        /* This triggers the focusOut event, which saves the model */
        this.get('parentView').set('titleEditing', false);
    },

    click: function(evt){
        evt.preventDefault();
    }
});

Ember.Handlebars.helper('edit-title', Photoworks.EditTitleTextView);

Photoworks.EditTitleView = Ember.View.extend({
    templateName: 'editTitle',
    titleEditing: false,

    actions: {
        editTitle: function(){
            this.set('titleEditing', true);
        },
        acceptTitleChange: function(){
            this.get('controller').send('acceptTitleChange');
        }

    }
});

Photoworks.UploadPhotosView = Ember.View.extend({
        templateName: 'addPhotos',

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
            for (var i = 0; i < files.length; i++){
                //console.log(files[i]);
                if (files[i].type.match("image.*")) {
                  /* Push a new view representing our photo to the container within the shadowbox */
                  Photoworks.NewPhotosContainer.pushObject(Photoworks.NewPhotosView.create({
                    file: files[i],
                  }));
                }
            }

            /* shadow box should now hold the new photos, lets show it */
            $('.shadowBox').width($(window).width());
            $('.shadowBox').height($(window).height());
            $('.shadowBox').fadeIn();
        },
});

/* Inside shadow box in addPhotos template,
 * holds each of the NewPhotosView */
Photoworks.NewPhotosContainer = Ember.ContainerView.create({
    childViews: [],
});

/* Used for each of our new photos to submit
 * image source is set in the drop function on create */
Photoworks.NewPhotosView = Ember.View.extend({
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
                Photoworks.NewPhotosContainer.removeObject(that);
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
            /* Remove our view object, fade out shadow box if empty */
            Photoworks.NewPhotosContainer.removeObject(that);
            if ($('.shadowBox>.ember-view').html() == ''){
                $('.shadowBox').fadeOut();
            }

          }

          /* Send out our request */
          xhr.send(formData);

        }
    }

});
