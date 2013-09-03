/*global define*/

define([
    'lodash',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ScheduleModel = Backbone.Model.extend({
        urlRoot: '/api/v1/schedule/',
        idAttribute: 'slug',
        defaults: {
            title: 'Default schedule title',
        },
        url: function() {
            var originalUrl = Backbone.Model.prototype.url.call(this);
            return originalUrl + (originalUrl.charAt(originalUrl.length - 1) == '/' ? '' : '/');
        },
    });

    return ScheduleModel;
});