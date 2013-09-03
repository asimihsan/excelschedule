/*global define*/

define([
    'lodash',
    'backbone',
    'models/schedule',
    'communicator'
], function (_, Backbone, SchedulesModel, Communicator) {
    'use strict';

    var SchedulesCollection = Backbone.Collection.extend({
        url: '/api/v1/schedule/',
        model: SchedulesModel,
        parse: function(response) {
            return response.objects;
        }
    });

    return SchedulesCollection;
});