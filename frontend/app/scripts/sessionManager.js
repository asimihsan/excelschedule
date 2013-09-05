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
            this.refreshCsrfToken();

            /* event API */
            Communicator.reqres.setHandler("SessionManager:getCsrfToken",
                                           this.getCsrfToken, this);
            Communicator.reqres.setHandler("SessionManager:isUserAuthenticated",
                                           this.isUserAuthenticated, this);
        },
        refreshCsrfToken: function() {
            $.ajax({
                url: '/api/csrf_token',
                dataType: 'json',
                context: this,
                success: function(response) {
                    this.csrf_token = response.csrf_token;
                    $.cookie('csrftoken', this.csrfToken);
                    Communicator.mediator
                                .trigger("SessionManager:refreshCsrfToken");
                },
            });
        },
        getCsrfToken: function() {
            return this.csrf_token;
        },
        isUserAuthenticated: function() {
            var promise = $.ajax({
                url: '/api/is_user_authenticated',
                dataType: 'json',
                context: this,
            });
            return promise;
        },
    });

    return new SessionManager();
});
