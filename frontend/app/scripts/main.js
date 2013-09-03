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
        'backbone.marionette': {
            deps: [
                'backbone',
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        'jquery.cookie': {
            deps: ['jquery'],
            exports: 'jquery'  
        },
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        'jquery.cookie': '../bower_components/jquery-cookie/jquery.cookie',
        backbone: '../bower_components/backbone/backbone',
        'backbone.marionette': '../bower_components/backbone.marionette/lib/backbone.marionette',
        lodash: '../bower_components/lodash/lodash',
        bootstrap: 'vendor/bootstrap'
    }
});

require([
    'backbone',
    'application',
    'regionManager',
    'sessionManager',
    'jquery.cookie',
], function (Backbone, App) {
    App.start();
});
