/*global define*/

define([
    'backbone.marionette',
    'collections/schedules',
    'views/schedules',
    'views/login',
    'communicator',
], function(Backbone, SchedulesCollection, SchedulesView, LoginView, Communicator) {
    'use strict';

    var RouteController = Backbone.Marionette.Controller.extend({
        view_schedule: function() {
            console.log("RouterController schedule");
            var mainRegion = 
                Communicator.reqres.request("RegionManager:getRegion",
                                            "mainRegion");
            mainRegion.close();
        },
        index: function() {
            console.log("RouterController index");
            var mainRegion = 
                Communicator.reqres.request("RegionManager:getRegion",
                                            "mainRegion");
            mainRegion.show(new LoginView());

            /*
            this.schedulesCollection = new SchedulesCollection();
            this.schedulesView = new SchedulesView({
                collection: this.schedulesCollection
            });
            this.schedulesCollection.reset([
                {slug: 'winter-2014', title: 'Winter 2014'},
                {slug: 'spring-2015', title: 'Spring 2015'}
            ]);
            this.schedulesView.render();
            var mainRegion = 
                Communicator.reqres.request("RegionManager:getRegion",
                                            "mainRegion");
            mainRegion.show(this.schedulesView);
            */
        },
    });

    return RouteController;
});
