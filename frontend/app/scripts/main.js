/*global require*/
'use strict';

require.config({
    shim: {
        lodash: {
            exports: '_'
        },
        backbone: {
            deps: [
                'lodash',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        lodash: '../bower_components/lodash/lodash',
        bootstrap: 'vendor/bootstrap'
    }
});

require([
    'backbone',
    'views/app',
    'routes/router',
], function (Backbone, App, Router) {
    new Router();

    var app = new App();
    app.start();
    app.render();
});
