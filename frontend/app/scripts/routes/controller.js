/*global define*/

define([
    'backbone.marionette',
    'collections/schedules',
    'views/schedules',
], function(Backbone, SchedulesCollection, SchedulesView) {
    'use strict';

    var RouteController = Backbone.Marionette.Controller.extend({
        initialize: function(options) {
            console.log("RouterController initialize");
        },
        view_schedule: function() {
            console.log("RouterController schedule");
            $("#app").empty();
        },
        index: function() {
            console.log("RouterController schedules");
            this.schedulesCollection = new SchedulesCollection();
            this.schedulesView = new SchedulesView({
                collection: this.schedulesCollection
            });
            this.schedulesCollection.reset([
                {slug: 'winter-2014', title: 'Winter 2014'},
                {slug: 'spring-2015', title: 'Spring 2015'}
            ]);
            this.schedulesView.render();
            $("#app").empty();
            $("#app").append(this.schedulesView.el);
        },
    });

    return RouteController;
});
