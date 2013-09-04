/*global define*/

define([
    'jquery',
    'backbone.marionette',
    'templates',
    'communicator',
], function ($, Backbone, JST, Communicator) {
    'use strict';

    var ScheduleUploadCsvView = Backbone.Marionette.ItemView.extend({
        template: JST['app/scripts/templates/scheduleUploadCsv.ejs'],
        className: 'scheduleUploadCsv',
        ui: {
            fileupload: '#fileupload',
            progress_bar: '#progress .progress-bar',
            files: '#files',
        },
        initialize: function() {
            this.csrfToken =
                     Communicator.reqres.request("SessionManager:getCsrfToken");
        },
        onRender: function() {
            var url = '/api/upload_csv/' + this.model.escape('slug');
            var that = this;
            this.ui.fileupload.fileupload({
                url: url,
                dataType: 'json',
                headers: {
                    'X-CSRFToken': that.csrfToken,
                },
                done: function (e, data) {
                    console.log("file uploaded");
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    that.ui.progress_bar.css(
                        'width',
                        progress + '%'
                    );
                }
            }).prop('disabled', !$.support.fileInput)
              .parent().addClass($.support.fileInput ? undefined : 'disabled');
        },
    });

    return ScheduleUploadCsvView;
});