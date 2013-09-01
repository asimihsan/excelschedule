/*global define*/

define([
    'jquery',
    'lodash',
    'backbone.marionette',
    'templates',
    'communicator',
    'routes/router',
    'collections/schedules',
    'views/schedules',
], function ($, _, Backbone, JST, Communicator, Router, 
             SchedulesCollection, SchedulesView) {
    'use strict';

    var template = JST['app/scripts/templates/app.ejs'];
    var App = new Backbone.Marionette.Application();
    App.addRegions({});
    App.addInitializer(function() {
        $("#app").append(template());
        Backbone.history.start({pushState: true});

        var router = new Router();
        router.navigate("", {trigger: true});

        this.schedulesCollection = new SchedulesCollection();
        this.schedulesView = new SchedulesView({
            collection: this.schedulesCollection
        });
        this.schedulesCollection.reset([
            {slug: 'winter-2014', title: 'Winter 2014'},
            {slug: 'spring-2015', title: 'Spring 2015'}
        ]);
        this.schedulesView.render();
        $("#app").append(this.schedulesView.el);
    });

    return App;
});