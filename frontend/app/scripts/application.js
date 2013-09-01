/*global define*/

define([
    'jquery',
    'lodash',
    'backbone.marionette',
    'templates',
    'communicator',
    'routes/router',
], function ($, _, Backbone, JST, Communicator, Router) {
    'use strict';

    var router = new Router();
    router.navigate("", {trigger: true});

    var template = JST['app/scripts/templates/app.ejs'];
    var App = new Backbone.Marionette.Application();
    Communicator.reqres.request("RM:addRegion", "mainRegion", "#app");
    App.addInitializer(function() {
        Backbone.history.start({pushState: false});
    });

    return App;
});