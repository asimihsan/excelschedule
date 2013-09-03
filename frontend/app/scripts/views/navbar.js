/*global define*/

define([
    'backbone.marionette',
    'templates',
], function (Backbone, JST) {
    'use strict';

    var NavbarView = Backbone.Marionette.ItemView.extend({
        template: JST['app/scripts/templates/navbar.ejs'],
        className: 'navbar',
    });

    return NavbarView;
});