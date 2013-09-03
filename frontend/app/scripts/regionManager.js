define([
    'backbone.marionette',
    'communicator',
    'layouts/mainLayout',
],
function(Backbone, Communicator, MainLayout) {
    'use strict';

    var RegionManager = Backbone.Marionette.Controller.extend({

        initialize: function( options ) {
            console.log("initialize a Region Manager");

            /* internal region manager */
            this._layout = new MainLayout();
            this._layout.render();

            /* event API */
            Communicator.reqres.setHandler("RegionManager:addRegion", this.addRegion, this);
            Communicator.reqres.setHandler("RegionManager:removeRegion", this.removeRegion, this);
            Communicator.reqres.setHandler("RegionManager:getRegion", this.getRegion, this);
        },

        /* add region facade */
        addRegion: function(regionName, regionId) {
            var region = this.getRegion(regionName);
            if(region) {
                console.log("REGION ALREADY CREATED TO JUST RETURN REF");
                return region;
            }
            return this._layout.addRegion(regionName, regionId);
        },

        /* remove region facade */
        removeRegion: function(regionName) {
            this._layout.removeRegion(regionName);
        },

        /* get region facade */
        getRegion: function(regionName) {
            return this._layout[regionName];
        }
    });

    return new RegionManager();
});
