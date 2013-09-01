/*global define*/

define([
    'backbone.marionette',
], function(Backbone) {
    'use strict';

    var RouteController = Backbone.Marionette.Controller.extend({
        initialize: function(options) {
            console.log("RouterController initialize");
        },
        view_schedule: function() {
            console.log("RouterController schedule");
        },
        view_schedules: function() {
            console.log("RouterController schedules");
        },
    });

    return RouteController;
});
