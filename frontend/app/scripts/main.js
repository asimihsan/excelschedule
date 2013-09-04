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
                'jquery',
                'jquery.ui.widget',
                'jquery.iframe-transport',
            ],
            exports: 'jquery',
        },
        'jquery.noty': {
            deps: ['jquery'],
            exports: 'noty'  
        },
        'jquery.noty.layout.top': {
            deps: ['jquery.noty'],
            exports: 'noty'  
        },
        'jquery.noty.themes.default': {
            deps: ['jquery.noty'],
            exports: 'noty'  
        },
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        'jquery.cookie': '../bower_components/jquery-cookie/jquery.cookie',
        'jquery.noty': '../bower_components/noty/js/noty/jquery.noty',
        'jquery.noty.layout.top': '../bower_components/noty/js/noty/layouts/top',
        'jquery.noty.themes.default': '../bower_components/noty/js/noty/themes/default',

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
    'jquery.noty',
    'jquery.noty.layout.top',
    'jquery.noty.themes.default',    
], function (Backbone, App) {
    App.start();
});
