/*global define*/

define([
    'jquery',
    'jquery.noty',
    'backbone.marionette',
    'templates',
    'communicator',
    'collections/surveyResults',
], function ($, noty, Backbone, JST, Communicator, SurveyResultsCollection) {
    'use strict';

    var ScheduleUploadCsvView = Backbone.Marionette.ItemView.extend({
        className: 'scheduleUploadCsv',
        ui: {
            fileupload: '#fileupload',
            progress_bar: '#progress .progress-bar',
            files: '#files',
        },
        initialize: function() {
            this.state = "started";
        },
        getTemplate: function() {
            if (this.state === "started")
                return JST['app/scripts/templates/scheduleUploadCsv.ejs'];
            else if (this.state === "finishedUpload")
                return JST['app/scripts/templates/scheduleUploadCsvFinishedUpload.ejs'];
            else if (this.state === "finishedProcessCsv")
                return JST['app/scripts/templates/scheduleUploadCsvFinishedProcessCsv.ejs'];
        },
        serializeData: function() {
            var data = {};
            if (this.collection) {
                data = {items: this.collection.toJSON()};
                _.extend(data, this.model.toJSON());
            } else if (this.model) {
                data = this.model.toJSON();
            }
            return data;
        },
        refreshCsrfToken: function(callback) {
            Communicator.command.execute("SessionManager:refreshCsrfToken");
            Communicator.mediator.on("SessionManager:refreshCsrfToken", function() {
                this.csrfToken =
                     Communicator.reqres.request("SessionManager:getCsrfToken");
                callback(this);
            }, this);
        },
        onRender: function() {
            this.refreshCsrfToken(this.setupFileUpload);
        },
        setupFileUpload: function(that) {
            var url = '/api/upload_csv/' + that.model.escape('slug');
            that.ui.fileupload.fileupload({
                url: url,
                dataType: 'json',
                headers: {
                    'X-CSRFToken': that.csrfToken,
                },
                done: function (e, data) {
                    console.log("file uploaded");
                    that.state = "finishedUpload";
                    that.result_id = data.result.result_id;
                    that.resultPollerTimer = setTimeout(function() {
                        that.resultPoller(that);
                    }, 1000);
                    that.render();
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
        resultPoller: function(that) {
            clearTimeout(that.resultPollerTimer);
            $.ajax('/api/get_async_task_status', {
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                data: {
                    'result_id': this.result_id,
                },
                context: that,
                success: function(response) {
                    if (response.ready === false) {
                        console.log("response not ready");
                        this.resultPollerTimer = setTimeout(function() {
                            this.resultPoller(this);
                        }, 1000);
                        return;
                    }
                    if (response.failed === true) {
                        console.log("Failed to process the CSV!");
                        return;
                    }
                    console.log("response ready");
                    this.state = "finishedProcessCsv";
                    this.collection = 
                      new SurveyResultsCollection(JSON.parse(response.result));
                    var n = noty({
                        text: "All done! Here are your results",
                        type: 'success',
                        layout: 'top',
                        timeout: 2000,
                    });
                    this.render();
                },
            });
        }
    });

    return ScheduleUploadCsvView;
});