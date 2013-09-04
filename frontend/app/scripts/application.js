/*global define*/

define([
    'backbone.marionette',
    'communicator',
    'routes/router',
], function (Backbone, Communicator, Router) {
    'use strict';

    var router = new Router();
    router.navigate("", {trigger: true});

    var App = new Backbone.Marionette.Application();
    Communicator.reqres.request("RegionManager:addRegion", "navbar",
                                "#navbar");
    Communicator.reqres.request("RegionManager:addRegion", "sidebar",
                                "#sidebar");
    Communicator.reqres.request("RegionManager:addRegion", "content",
                                "#content");
    App.addInitializer(function() {
        Backbone.history.start({pushState: false});
    });

    return App;
});