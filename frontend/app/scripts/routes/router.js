define([
    'backbone.marionette',
    'routes/controller'
], function(Backbone, RouteController) {
    'use strict';

    var Router = Backbone.Marionette.AppRouter.extend({
        controller: new RouteController(),
        appRoutes: {
            'schedule/:slug':   'view_schedule',
            '':                 'index',
        },
    });

    return Router;
});
