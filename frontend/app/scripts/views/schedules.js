/*global define*/

define([
    'backbone.marionette',
    'templates',
    'views/schedule'
], function (Backbone, JST, ScheduleView) {
    'use strict';

    var SchedulesView = Backbone.Marionette.CompositeView.extend({
        template: JST['app/scripts/templates/schedules.ejs'],
        itemView: ScheduleView,
        tagName: 'table',
        className: 'table table-bordered table-hover',
    });

    return SchedulesView;
});