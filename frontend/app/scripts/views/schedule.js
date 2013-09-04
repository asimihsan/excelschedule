/*global define*/

define([
    'jquery',
    'lodash',
    'backbone.marionette',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var ScheduleView = Backbone.Marionette.ItemView.extend({
        template: JST['app/scripts/templates/schedule.ejs'],
        tagName: 'tr',
        events: {
            'click a[data-internal]': function(e) {
                e.preventDefault();
                Backbone.history.navigate($(e.target).attr('href')
                                                     .replace(/^\/?#/, ''),
                                         {trigger: true});
            }
        },
    });

    return ScheduleView;
});