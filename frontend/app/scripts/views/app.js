/*global define*/

define([
    'jquery',
    'lodash',
    'backbone',
    'templates',
    'collections/schedules',
    'views/schedules',
], function ($, _, Backbone, JST, SchedulesCollection, SchedulesView) {
    'use strict';

    var App = Backbone.View.extend({
        template: JST['app/scripts/templates/app.ejs'],
        el: '#app',
        start: function() {
            Backbone.history.start({pushState: true});
            this.schedulesCollection = new SchedulesCollection();
            this.schedulesView = new SchedulesView({
                collection: this.schedulesCollection
            });
            this.schedulesCollection.reset([
                {title: 'Winter 2014'},
                {title: 'Spring 2015'}
            ]);
            //this.schedulesCollection.fetch();
        },
        render: function() {
            this.$el.html(this.schedulesView.render().el);
        },
    });

    return App;
});