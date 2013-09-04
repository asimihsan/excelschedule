/*global define*/

define([
    'backbone',
    'models/surveyResult',
], function (Backbone, SurveyResultModel) {
    'use strict';

    var SurveyResultsCollection = Backbone.Collection.extend({
        url: '/api/v1/survey_result/',
        model: SurveyResultModel,
        parse: function(response) {
            return response.objects;
        }
    });

    return SurveyResultsCollection;
});