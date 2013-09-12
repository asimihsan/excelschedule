/*global define*/

define([
    'backbone'
], function (Backbone) {
    'use strict';

    var SurveyResultModel = Backbone.Model.extend({
        urlRoot: '/api/v1/survey_result/',
        defaults: {
            start_date: '',
            end_date: '',
            name: '',
            course_title: '',
            course_number: '',
            first_choices: [],
            second_choices: [],
            third_choices: [],
            other_additional_availability: '',
            other_preferred_times: '',
            unavailable_times: '',
            no_conflict_courses: '',
            other_comments: '',
            max_students: '',
            is_special_permission_required: '',
            is_first_class_attendance_mandatory: '',
            grading_option: '',
        },
        url: function() {
            var originalUrl = Backbone.Model.prototype.url.call(this);
            return originalUrl + (originalUrl.charAt(originalUrl.length - 1) == '/' ? '' : '/');
        },
    });

    return SurveyResultModel;
});