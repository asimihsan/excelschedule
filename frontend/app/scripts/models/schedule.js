/*global define*/

define([
    'lodash',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ScheduleModel = Backbone.Model.extend({
        defaults: {
            title: '',
        }
    });

    return ScheduleModel;
});