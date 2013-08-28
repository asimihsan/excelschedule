/*global define*/

define([
    'lodash',
    'backbone',
    'models/schedule'
], function (_, Backbone, SchedulesModel) {
    'use strict';

    var SchedulesCollection = Backbone.Collection.extend({
        model: SchedulesModel
    });

    return SchedulesCollection;
});