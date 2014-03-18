/*
ToDo:
	-Implement photo gallery
	-About me page
	- Filter print gallery by type?
	-Update print details page with pictures
	- ADMIN options - add/remove photos, galleries, pages, etc...
	-RESTful API - or just use fixtures
*/

/* Create the ember application registered to a global variable */
window.Photoworks = Ember.Application.create({
    LOG_TRANSITIONS: true
});

/* Using fixture adapter for now, change to RESTful */
Photoworks.ApplicationAdapter = DS.FixtureAdapter.extend();

/* Local storage for the shopping cart */
Photoworks.CartItemSerializer = DS.LSSerializer.extend();
Photoworks.CartItemAdapter = DS.LSAdapter.extend({
	namespace: 'photoworks'
});

/* Pulling galleries from our REST API*/
Photoworks.GalleryAdapter = DS.RESTAdapter.extend();

Photoworks.PhotoAdapter = DS.RESTAdapter.extend();

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






 	