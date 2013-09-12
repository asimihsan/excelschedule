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
            Communicator.reqres.setHandler("SessionManager:isUserAuthenticated",
                                           this.isUserAuthenticated, this);
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
