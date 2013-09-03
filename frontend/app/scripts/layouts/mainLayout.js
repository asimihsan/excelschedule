/*global define*/

define([
    'backbone.marionette',
    'templates'
], function (Backbone, JST) {
    'use strict';

    var MainLayout = Backbone.Marionette.Layout.extend({
        template: JST['app/scripts/templates/mainLayout.ejs'],
        el: '#app',
        regions: {
            navbar: '#navbar',
            container: '#content',
        },
    });

    return MainLayout;
});