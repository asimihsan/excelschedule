/*global define*/

define([
    'jquery',
    'lodash',
    'backbone.marionette',
    'templates',
    'views/schedule'
], function ($, _, Backbone, JST, ScheduleView) {
    'use strict';

    var SchedulesView = Backbone.Marionette.CompositeView.extend({
        template: JST['app/scripts/templates/schedules.ejs'],
        itemView: ScheduleView,
        tagName: 'ul',
    });

    return SchedulesView;
});