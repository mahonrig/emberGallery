var resizeHandler = function() {
    $('.galleriesMain').height($(window).height());
    $('.galleryPreview').each(function(index){
      if ($(window).width() < 512){
        var pos = index * 124;
        $(this).css('width', '128px');
      } else {
        var pos = index * 250;
        $(this).css('width', '256px');
      }

      $(this).css({
          'left': pos,
          'z-index': 100 - index
      });
    });

    if ($('#photoShadowBox').hasClass('visible')){
      $('#photoShadowBox').width($(window).width()).height($(window).height());
      var $w = $(window);
      var wW = $w.width();
      var wH = $w.height();
      var wW9 = wW * .9;
      var wH9 = wH * .9;
      var $that = $('.largePhoto').parent().parent();
      var width = $that.width();
      var height = $that.height();
      if (!(wW >= 1280)){
        if (width > height){
          $that.width(wW9);
          if ($that.height() > wH9){
            $that.height(wH9);
            var ratio = $that.height() / height;
            $that.width(width * ratio);
          }
        } else {
          $that.height(wH9);
          var ratio = $that.height() / height;
          $that.width(width * ratio);
          if ($that.width() > wW9){
            $that.width(wW9);
          }
        }
      }
      if (!(wH >= 1280)){
        if ($that.height() > wH9){
          $that.height(wH9);
          var ratio = $that.height() / height;
          $that.width(width * ratio);
        }
      }
      $that.css('position', 'absolute');
      $that.css('left', ((wW - $that.width()) / 2));
      $that.css('top', ((wH - $that.height()) / 4));
    }
};

App.ApplicationView = Ember.View.extend({

  willAnimateIn: function(){
    this.$().hide();
  },

  animateIn: function(done){
    var that = this;
    imagesLoaded('#app', function(){
        that.$().fadeIn(done);
    });

  },

  hiddenLinks: false,

  didAnimateIn: function(){
    if ($('.galleryLinks').width() > ($('.banner').width() * .6)){
      this.set('hiddenLinks', true);
    }
  },

  animateOut: function(done){
    this.$().fadeOut(done);
  },

  didInsertElement: function(){
    /* Helps to center some elements (login) vertically */
    this.$('#app').height($(window).height());
  },
});

App.CartView = Ember.View.extend({
  templateName: 'cart',
});

App.CartItemView = Ember.View.extend({
  animateIn: function(done){
    this.$().fadeIn(done);
  },
  animateOut: function(done){
    this.$().fadeOut(done);
  },
});

App.GalleriesView = Ember.View.extend({
    templateName: 'galleries',
    willAnimateIn: function(){
      this.$().hide();

      /* Fixes the overflow scrolling */
      $('.galleriesMain').height($(window).height());
      $('.galleryPreview').each(function(index){
        if ($(window).width() < 512){
          var pos = index * 124;
          $(this).css('width', '128px');
        } else {
          var pos = index * 250;
          $(this).css('width', '256px');
        }

        $(this).css({
            'left': pos,
            'z-index': 100 - index
        });
      });
    },
    animateIn: function(done){
      var pos = 0;
      var that = this;
      imagesLoaded('#app', function(){
        $('.photoSmall').hide().each(function(index){
          $(this).css('z-index', 100 - index);
          $(this).css('top', -200 * (index + 1));
        }).fadeIn().animate({top: 0}, 1250);
        that.$().fadeIn(1250, function(){
        //  $('.galleriesMain').css('top', $('.banner').height());
          done();
        });
      });


    },

    didAnimateIn: function(){
        this.set('resizeHandler', resizeHandler);
        $(window).bind('resize', this.get('resizeHandler'));
    },

    animateOut: function(done){
      $('.galleryPreview .photoSmall').each(function(index){
          $(this).animate({top: -200 * (index + 1)}, 1250);
      });
      $(window).unbind('resize', this.get('resizeHandler'));
      this.$().fadeOut(1250, done);
    },

    didInsertElement: function() {
        $('title').text('All Galleries');
        $('.photoSmall').click(function(){
          $(this).addClass('picked');
          console.log('picked');
        });
    },

});

App.AvailablePhotosView = Ember.View.extend({
  templateName: 'availablePhotos',
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
    willAnimateIn: function(){
      this.$().hide();
    },
    animateIn: function(done){
      var pos = 0;
      var that = this;
      imagesLoaded('.galleryView', function(){
        $('.mediumPhoto').hide().each(function(index){
          $(this).css('z-index', 100 - index);
          $(this).css('top', -400 * (index + 1));
        }).fadeIn().animate({top: 0}, 750);
        that.$().fadeIn(750, function(){
        //  $('.galleryView').css('top', $('.banner').height());
          done();
        });
      });


    },
    animateOut: function(done){
      $('.mediumPhoto').each(function(index){
          $(this).animate({top: -400 * (index + 1)}, 750);
      });
      $(window).unbind('resize', this.get('resizeHandler'));
      this.$().fadeOut(750, done);
    },

    didAnimateIn: function(){
      this.set('resizeHandler', resizeHandler);
      $(window).bind('resize', this.get('resizeHandler'));
    },

    modelChanged: function(){
        imagesLoaded('.galleryView', function(){
          $('.mediumPhoto').each(function(index){
            $(this).css('z-index', 100 - index);
          });
        });
    }.observes('controller.model'),

    didInsertElement: function() {
        var controller = this.get('controller');
        $('title').text('Viewing Gallery - ' + controller.get('model.title'));

    }

});

App.SlideshowView = Ember.View.extend({
  interval: 0,
  slideshow: true,
  willAnimateIn: function(){
    this.$().hide();
    this.$('.currentPhoto').hide();
    this.$('.prevPhoto').hide()
    this.$('.nextPhoto').hide();;
  },
  animateIn: function(done){
    var that = this;
    imagesLoaded('#app', function(){
      that.$().fadeIn(done);
    });

  },

  didAnimateIn: function(){
    var that = this;
  //  var height = $('.banner').height();
  //  this.$('.currentPhoto').css('top', '-1000px').show().animate({top: height - 10}, 1000);

    if (this.get('slideshow')){
      var interval = setInterval(function() {
        that.get('controller').send('goToNextPhoto');
      }, 3000);
      this.set('interval', interval);
    }
    this.get('controller.store').find('site', 1).then(function(site){
      $('title').html('Welcome to ' + site.get('title'));
    });

    this.set('resizeHandler', resizeHandler);
    $(window).bind('resize', this.get('resizeHandler'));

  },

  animateOut: function(done){
    var interval = this.get('interval');
    clearInterval(interval);
    $(window).unbind('resize', this.get('resizeHandler'));
    this.$().fadeOut(done);
  },

  actions: {
    pauseSlideShow: function(){
      if (this.get('slideshow')){
        console.log('pause');
        var interval = this.get('interval');
        clearInterval(interval);
        this.set('slideshow', false);
      }
    },

    resumeSlideShow: function(){
      var that = this;
      if (!this.get('slideshow')){
        console.log('resume');
        that.get('controller').send('goToNextPhoto');
        var interval = setInterval(function() {
          that.get('controller').send('goToNextPhoto');
        }, 3000);
        this.set('interval', interval);
        this.set('slideshow', true);
      }
    },

    prev: function(){
      if (this.get('slideshow')){
        console.log('pause');
        var interval = this.get('interval');
        clearInterval(interval);
        this.set('slideshow', false);
      }
      this.get('controller').send('goToPrevPhoto');
    },

    next: function(){
      if (this.get('slideshow')){
        console.log('pause');
        var interval = this.get('interval');
        clearInterval(interval);
        this.set('slideshow', false);
      }
      this.get('controller').send('goToNextPhoto');
    }
  }
});

App.GalleriesPhotoView = Ember.View.extend({
  willAnimateIn: function(){
    this.$().hide();
    $('title').html(this.get('controller.model.title'));
  },

  animateIn: function(done){
    var that = this;
    $('#photoShadowBox').width($(window).width()).height($(window).height()).fadeIn(function(){
      $(this).addClass('visible');
      imagesLoaded('.largePhoto', function(){
        var $w = $(window);
        var wW = $w.width();
        var wH = $w.height();
        var wW9 = wW * .9;
        var wH9 = wH * .9;
        var $that = that.$();
        var width = $that.width();
        var height = $that.height();
        if (!(wW >= 1280)){
          if (width > height){
            $that.width(wW9);
            if ($that.height() > wH9){
              $that.height(wH9);
              var ratio = $that.height() / height;
              $that.width(width * ratio);
            }
          } else {
            $that.height(wH9);
            var ratio = $that.height() / height;
            $that.width(width * ratio);
            if ($that.width() > wW9){
              $that.width(wW9);
            }
          }
        } else {
          $that.width(1280);
        }
        if (!(wH >= 1280)){
          if ($that.height() > wH9){
            $that.height(wH9);
            var ratio = $that.height() / height;
            $that.width(width * ratio);
            if ($that.width() > wW9){
              $that.width(wW9);
            }
          }
        }
        $that.css('position', 'relative');
      //  $that.css('left', ((wW - $that.width()) / 2));
        $that.css('top', ((wH - $that.height()) / 4));
        $that.fadeIn(done);
      });
    });
  },

  animateOut: function(done){
    this.$().fadeOut(function(){
      $('title').html('All Galleries');
      $('#photoShadowBox').fadeOut(function(){
        $(this).removeClass('visible');
        done();
      });
    });
  },
});

App.GalleryPhotoView = App.GalleriesPhotoView.extend();
App.SlideshowPhotoView = App.GalleriesPhotoView.extend();
App.AdminPhotoView = App.GalleriesPhotoView.extend();

App.LargePhotoView = Ember.View.extend({
  templateName: 'largephoto',
  actions: {
    showOrder: function(){
      if (!$('.order').hasClass('visible')){
        $('.order').fadeIn();
        $('.order').addClass('visible');
      } else {
        $('.order').fadeOut();
        $('.order').removeClass('visible');
      }
    }
  },
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
        App.stop = false;
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
            App.stop = true;
        },
    }
});

/* .shadowBox is located on main page */
 container = Ember.ContainerView.extend({
   observeLength: function(){
     if (this.get('length') > 0){
       $('.shadowBox').width($(window).width());
       $('.shadowBox').height($(window).height());
       $('.shadowBox').fadeIn();
     } else {
       $('.shadowBox').fadeOut();
     }
   }.observes('length')
 });

App.NewPhotosContainer = container.create();

App.UploadPhotosView = Ember.View.extend({

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
                  App.NewPhotosContainer.pushObject(App.NewPhotosView.create({
                    file: files[i],
                  }));
                  App.NewPhotosContainer.set('count', count);
                }
            }
      },

        doubleClick: function(event){
          $('#uploadInput').click();

        }
});

App.EachGalleryView = Ember.View.extend({
  animateOut: function(done){
    this.$().fadeOut(done);
  }
});

App.AboutView = Ember.View.extend({
  animateIn: function(done){
    this.$().fadeIn(done);
  },

  animateOut: function(done){
    this.$().fadeOut(done);
  }
});

App.PrintDetailsView = App.AboutView.extend();

/* Used for each of our new photos to submit
 * image source is set in the drop function on create */
App.NewPhotosView = Ember.View.extend({
  animateIn: function(done){
    this.$().fadeIn(done);
  },
  animateOut: function(done){
    this.$().fadeOut(done);
  },
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

    /*animateOut: function(done){
      //this.$().fadeOut(done);
    },*/

    actions: {

        /* fade out / remove photo, if lightbox is empty, fade it out */
        cancel: function(){
          App.NewPhotosContainer.removeObject(this);
        },

        /* Upload photo to server, which resizes and saves
         * Should resize these photos to some max size or under
         * and then upload. */
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
            /* Remove our view object */
            App.NewPhotosContainer.removeObject(that);
          }

          /* Send out our request */
          xhr.send(formData);

        }
    }

});

App.addedGallery = false;
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
        var response = JSON.parse(xhr.responseText);
        App.addedGallery = true;
        App.Gallery.store.push('gallery', {
          id: response.id,
          title: response.title
        });

      }

      /* Send out our request */
      xhr.send(formData);
    }
  }
});

App.DroppablePhotoView = Ember.View.extend({
  dragStart: function(event){
    if (window.admin){
      event.dataTransfer.setData('photo_id',event.target.id);
      event.dataTransfer.setData('gallery_id', event.target.getAttribute('data-gallery'));
      $('.removePhoto').slideDown();
    }
  },

  dragEnd: function(event){
    $('.removePhoto').slideUp();
  }

});
App.Dropped = false;
App.AddPhotoView = Ember.View.extend({
  willAnimateIn: function(){
    if (App.addedGallery){
        this.$().hide();
    }

  },

  animateIn: function(done){
    if (App.addedGallery){
      App.addedGallery = false;
      $('.galleryPreview').each(function(index){
        var pos = index * 250;
        $(this).css('left', pos);
        $(this).css('z-index', 100 - index);
      });
    /*  $('.galleriesMain .galleryTitle').each(function(index){
        $(this).css('z-index', 300-index);
        $(this).css('left', index * 250);
        $(this).fadeIn();
      });*/
      this.$().fadeIn(done);
    } else {
      done();
    }
  },

  animateOut: function(done){
    if (App.deletedGallery){
      App.deletedGallery = false;
      this.$().fadeOut(done);
    }
  },

  dragEnter: function(event) {
      event.preventDefault();
  },

  dragOver: function(event) {
      event.preventDefault();
  },

  drop: function(event) {
    if (window.admin){
      event.preventDefault();
      var data = event.dataTransfer.getData('photo_id');
      this.get('controller').send('addPhoto', data);
      App.Dropped = true;
    }
  },


});

App.PhotoSmallView = Ember.View.extend({
  willAnimateIn: function(){
    if (App.Dropped){
      this.$('.photoSmall').hide();
    }
  },
  animateIn: function(done){
      if (App.Dropped){
        App.Dropped = false;
        /* Set z-index */
        this.$().parent().find('.photoSmall').each(function(index){
          $(this).css('z-index', 100 - index);
        });
        this.$('.photoSmall').css('top', '-300px').fadeIn();
        this.$('.photoSmall').animate({top: 0}, 500, done);
      }
  },

  animateOut: function(done){
    if (App.Dropped){
      this.$().fadeOut(done);
      App.Dropped == false;
    }
  },

  mouseEnter: function(event){
    $(event.target).animate({top: '5px'}, 250);
  },

  mouseLeave: function(event){
    $(event.target).animate({top: '0'}, 250);
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
      App.Dropped = true;
    } else { /* Dropped from sidebar, delete photo */
      this.get('controller').send('removePhoto', photo_id);
    }
    $('.removePhoto').slideUp(); /* usually dragEnd handles this, but not if photo is removed */
  }
});

App.EachAvailableView = Ember.View.extend({
  animateIn: function(done){
    this.$().fadeIn(done);
  },
  animateOut: function(done){
    this.$().fadeOut(done);
  }
});

App.SharingPhotoView = Ember.View.extend({
  templateName: 'sharing',

  mobile: function(){
    if ($(window).width() < 512){
      return true;
    } else {
      return false;
    }
  }.property('controller.model'),

  url: function(){
    return encodeURIComponent(window.location.href);
  }.property('controller.currentPhoto.id'),

  thumb: function(){
    return encodeURIComponent('http://mgibsonphotoworks.com' + this.get('controller.currentPhoto.thumbFile'));
  }.property('controller.currentPhoto.thumbFile'),

  large: function(){
    return encodeURIComponent('http://mgibsonphotoworks.com' + this.get('controller.currentPhoto.largeFile'));
  }.property('controller.currentPhoto.largeFile'),

  title: function(){
    return encodeURIComponent(this.get('controller.currentPhoto.title'));
  }.property('controller.currentPhoto.title'),

  twitterURL: function(){
    var base = 'http://twitter.com/share?url=';
    var url = this.get('url');
    var message = this.get('title');
    var handle = this.get('controller.site.twitter');
    return base + url + '&text=' + message + '&via=' + handle;
  }.property('controller.currentPhoto', 'controller.site'),

  facebookURL: function(){
    var base = 'http://facebook.com/sharer.php?s=100&p[url]=';
    var url = this.get('url');
    var thumb = this.get('thumb');
    var title = this.get('title');
    var summary = encodeURIComponent(this.get('controller.currentPhoto.caption') || 'Photo from Mahonri Gibson Photographic Works');
    return base + url + '&p[images][0]=' + thumb + '&p[title]=' + title + '&p[summary]=' + summary;
  }.property('controller.currentPhoto'),

  tumblrURL: function(){
    var base = 'http://www.tumblr.com/share/link?url=';
    var url = this.get('url');
    var title = this.get('title');
    var desc = encodeURIComponent(this.get('controller.currentPhoto.caption') || 'Photo from Mahonri Gibson Photographic Works');
    return base + url + '&name=' + title + '&description=' + desc;
  }.property('controller.currentPhoto'),

  gplusURL: function(){
    var base = 'https://plus.google.com/share?url=';
    var url = this.get('url');
    return base + url;
  }.property('controller.currentPhoto'),

  pinterestURL: function(){
    var base = 'https://pinterest.com/pin/create/bookmarklet/?media='
    var large = this.get('large');
    var url = this.get('url');
    var title = this.get('title');
    return base + large + '&url=' + url + '&description=' + title;
  }.property('controller.currentPhoto'),

  emailURL: function(){
    var base = 'mailto:?subject=';
    var subject = this.get('title');
    var body = 'Check this out: <a href="' + this.get('url') + '">' + subject + '</a>';
    return base + subject + '&body=' + body;
  }.property('controller.currentPhoto'),

  flattrURL: function(){
    var handle = this.get('controller.site.twitter');
    var base = 'https://flattr.com/submit/auto?user_id=' + handle + '&url=' + this.get('url');
    return base;
  }.property('controller.currentPhoto'),

  click: function(event){
    event.preventDefault();
    var $target = $(event.target);
    var href = $target.attr('href');
    var width = $(window).width() * .8;
    var height = $(window).height() * .8;
    var leftPosition, topPosition;
    //Allow for borders.
    leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
    //Allow for title and status bars.
    topPosition = (window.screen.height / 2) - ((height / 2) + 50);
    //Open the window.
    window.open(href, "Window2", "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");

  },

});

App.AdminView = Ember.View.extend({
  willAnimateIn: function(){
    this.$().hide();
  },
  animateIn: function(done){
    this.$().fadeIn(done);
  },

  animateOut: function(done){
    this.$().fadeOut(done);
  }
});
