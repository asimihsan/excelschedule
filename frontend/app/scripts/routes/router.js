define([
    'backbone.marionette',
    'routes/controller'
], function(Backbone, RouteController) {
    'use strict';

    var Router = Backbone.Marionette.AppRouter.extend({
        controller: new RouteController(),
        appRoutes: {
            '':                 'index',
            'schedule/:slug':   'view_schedule',
            'login':            'login',
            'schedules':        'schedules',
        },
    });

    return Router;
});
