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
        this.get('controller').send('slideUp');
        this.get('controller').send('showPhotos');
        $('title').text('Viewing Gallery - ' + this.get('controller').get('model.title'));
    }
});

Photoworks.PhotoView = Ember.View.extend({
    templateName: 'photo',
    didInsertElement: function() {
        this.get('controller').send('slideUp');
        this.get('controller').send('hidePhotos');
        $('title').text(this.get('controller').get('model.title'));
    }
});