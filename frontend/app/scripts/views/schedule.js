/*global define*/

define([
    'jquery',
    'lodash',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var ScheduleView = Backbone.View.extend({
        template: JST['app/scripts/templates/schedule.ejs'],
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
    });

    return ScheduleView;
});