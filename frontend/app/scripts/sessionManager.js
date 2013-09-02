define([
    'jquery',
    'backbone.marionette',
    'communicator'
],
function($, Backbone, Communicator) {
    'use strict';

    var SessionManager = Backbone.Marionette.Controller.extend({
        initialize: function(options) {
            console.log("initialize a Session Manager");

            /* event API */
            Communicator.command.setHandler("SessionManager:refreshCsrfToken",
                                            this.refreshCsrfToken, this);
            Communicator.reqres.setHandler("SessionManager:getCsrfToken",
                                           this.getCsrfToken, this);
        },
        refreshCsrfToken: function() {
            $.ajax({
                url: '/api/csrf_token',
                dataType: 'json',
                context: this,
                success: function(response) {
                    this.csrf_token = response.csrf_token;
                    Communicator.mediator
                                .trigger("SessionManager:refreshCsrfToken");
                },
            });
        },
        getCsrfToken: function() {
            return this.csrf_token;
        },
    });

    return new SessionManager();
});
