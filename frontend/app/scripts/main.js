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
        'jquery.fileupload': {
            deps: [
                'jquery.ui.widget',
                'jquery.iframe-transport',
            ],
            exports: 'jquery',
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        'jquery.cookie': '../bower_components/jquery-cookie/jquery.cookie',

        'jquery.ui.widget': '../bower_components/jquery-file-upload/js/vendor/jquery.ui.widget',
        'jquery.iframe-transport': '../bower_components/jquery-file-upload/js/jquery.iframe-transport',
        'jquery.fileupload': '../bower_components/jquery-file-upload/js/jquery.fileupload',

        backbone: '../bower_components/backbone/backbone',
        'backbone.marionette': '../bower_components/backbone.marionette/lib/backbone.marionette',
        lodash: '../bower_components/lodash/lodash',
        bootstrap: 'vendor/bootstrap',
    }
});

require([
    'backbone',
    'application',
    'regionManager',
    'sessionManager',
    'jquery.cookie',
    'jquery.fileupload',
], function (Backbone, App) {
    App.start();
});
