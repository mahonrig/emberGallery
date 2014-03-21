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
        this.get('controller').send('hideGalleries');
        this.get('controller').send('showPhotos');
        $('title').text('Viewing Gallery - ' + this.get('controller').get('model.title'));
    }
});

Photoworks.PhotoView = Ember.View.extend({
    templateName: 'photo',
    didInsertElement: function() {
        this.get('controller').send('hideGalleries');
        this.get('controller').send('hidePhotos');
        $('title').text(this.get('controller').get('model.title'));
    }
});

Photoworks.OrderView = Ember.View.extend({
    templateName: 'order',
    didInsertElement: function(){
        imagesLoaded( '.productLarge', function() {
            var $largeImage = $('.largeImage');
            var imgWidth = $largeImage.width();
            var imgHeight = $largeImage.height();
            var windowWidth = $( window ).width();
            var windowHeight = $( window ).height();
            if (imgWidth >= imgHeight){
                $largeImage.width(windowWidth * .9);
                if ($largeImage.height() > windowHeight){
                    var factor = (windowHeight * .8) / $largeImage.height();
                    $largeImage.height($largeImage.height() * factor);
                    $largeImage.width($largeImage.width() * factor);
                }
            } else {
                $largeImage.height(windowHeight * .8);
            }
        });
    }
});

Photoworks.EditTitleTextView = Ember.TextField.extend({
    didInsertElement: function() {
        this.$().attr('size', this.$().val().length * 1.1);
        this.$().focus();
    },
    focusOut: function(){
        this.get('parentView').set('titleEditing', false);
        this.get('parentView').send('acceptTitleChange');
    },
    
    insertNewline: function(evt){
        this.get('parentView').set('titleEditing', false);
        this.get('parentView').send('acceptTitleChange');
    }
});

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

Ember.Handlebars.helper('edit-title', Photoworks.EditTitleTextView);