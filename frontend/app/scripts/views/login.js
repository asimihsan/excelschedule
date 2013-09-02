/*global define*/

define([
    'backbone.marionette',
    'templates',
    'communicator',
], function (Backbone, JST, Communicator) {
    'use strict';

    var LoginView = Backbone.Marionette.ItemView.extend({
        template: JST['app/scripts/templates/login.ejs'],
        className: 'row',
        ui: {
            error: 'div.alert-error',
            csrfToken: 'input.csrf-token',
        },
        initialize: function() {
            this.refreshCsrfToken();
        },
        onRender: function() {
            this.hideError();
        },
        showError: function() {
            this.ui.error.show();
        },
        hideError: function() {
            this.ui.error.hide();
        },
        refreshCsrfToken: function() {
            Communicator.command.execute("SessionManager:refreshCsrfToken");
            Communicator.mediator.on("SessionManager:refreshCsrfToken", function() {
                var csrfToken =
                     Communicator.reqres.request("SessionManager:getCsrfToken");
                this.ui.csrfToken.val(csrfToken);
            }, this);
        },
    });


    return LoginView;
});