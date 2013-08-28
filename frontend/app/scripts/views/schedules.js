/*global define*/

define([
    'jquery',
    'lodash',
    'backbone',
    'templates',
    'views/schedule',
    'models/schedule',
], function ($, _, Backbone, JST, ScheduleView, ScheduleModel) {
    'use strict';

    var SchedulesView = Backbone.View.extend({
        template: JST['app/scripts/templates/schedules.ejs'],
        render: function() {
            var schedules = this.collection.map(function(schedule) {
                return new ScheduleModel(schedule.attributes);
            });
            this.$el.html(this.template({
                'schedules': schedules,
                renderSchedule: function(schedule) {
                    var scheduleView = new ScheduleView({
                        model: schedule,
                    });
                    scheduleView.render();
                    return scheduleView.$el.html();
                },
            }));
            return this;
        },
    });

    return SchedulesView;
});