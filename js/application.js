/*
* ToDo:
*	-About me page
*	- Filter print gallery by type?
*	-Update print details page with pictures
*	- ADMIN options - add/remove photos, galleries, pages, etc...
*	- DB backend
*   - Graceful error handling in Ember app and Slim backend
*   - Setup (for other people to use)
*   - Social sharing buttons
*   - Lightbox, slideshow
*/

/* Create the ember application registered to a global variable */
window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

/* Still using fixture adapter for Options */
App.ApplicationAdapter = DS.FixtureAdapter.extend();

/* Local storage for the shopping cart */
App.CartItemSerializer = DS.LSSerializer.extend();
App.CartItemAdapter = DS.LSAdapter.extend({
	namespace: 'photoworks'
});

/* Pulling galleries from our REST API*/
App.GalleryAdapter = DS.RESTAdapter.extend();

/* Pull photos from REST */
App.PhotoAdapter = DS.RESTAdapter.extend();

App.SiteAdapter = DS.RESTAdapter.extend();

/* Modify link-to to be able to add optional action */
Ember.LinkView.reopen({
  action: null,
  _invoke: function(event){
    var action = this.get('action');
    if(action) {
      // There was an action specified (in handlebars) so take custom action
      event.preventDefault(); // prevent the browser from following the link as normal
      if (this.bubbles === false) { event.stopPropagation(); }

      // trigger the action on the controller
      this.get('controller').send(action, this.get('actionParam'));
      return false;
    }

    // no action to take, handle the link-to normally
    return this._super(event);
  }
});
