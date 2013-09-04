/*global define*/

define([
    'backbone.marionette',
    'templates',
], function (Backbone, JST) {
    'use strict';

    var ScheduleDetailView = Backbone.Marionette.ItemView.extend({
        template: JST['app/scripts/templates/scheduleDetail.ejs'],
        className: 'scheduleDetail',
    });

    return ScheduleDetailView;
});