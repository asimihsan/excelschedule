/*global define*/

define([
    'jquery',
    'lodash',
    'backbone.marionette',
    'templates',
    'communicator',
], function ($, _, Backbone, JST, Communicator) {
    'use strict';

    var LoginView = Backbone.Marionette.ItemView.extend({
        template: JST['app/scripts/templates/login.ejs'],
        className: 'row',
        ui: {
            error: 'div.alert-error',
            errorMessage: 'div.alert-error .message',
            csrfToken: 'input.csrf-token',
            form: 'form',
        },
        events: {
            'submit form': 'submit',
        },
        initialize: function() {
            this.refreshCsrfToken();
        },
        onRender: function() {
            this.hideError();
            this.testCookies();
        },
        showError: function(message) {
            this.ui.errorMessage.text(message);
            this.ui.error.show();
        },
        hideError: function() {
            this.ui.error.hide();
        },
        refreshCsrfToken: function() {
            Communicator.command.execute("SessionManager:refreshCsrfToken");
            Communicator.mediator.on("SessionManager:refreshCsrfToken", function() {
                this.csrfToken =
                     Communicator.reqres.request("SessionManager:getCsrfToken");
                this.ui.csrfToken.val(this.csrfToken);
            }, this);
        },
        submit: function(e) {
            e.preventDefault();
            $.ajax(this.ui.form.attr('action'), {
                context: this,
                type: this.ui.form.attr('method'),
                dataType: 'json',
                data: this.ui.form.serialize(),
                success: function(response) {
                    var url = localStorage.getItem('urlAfterLogin') || '#schedules';
                    localStorage.removeItem('urlAfterLogin');
                    Backbone.history.navigate(url, {trigger: true});
                },
                error: function(response) {
                    var responseText = $.parseJSON(response.responseText);
                    this.showError(responseText.message);
                }
            });
        },
        testCookies: function() {
            var cookieName = '__excelschedule_test_cookie';
            $.cookie(cookieName, 'testvalue');
            if ($.cookie(cookieName) === undefined) {
                this.showError("Cookies are not enabled. You must enable cookies to use this site.");
            } else {
                $.removeCookie(cookieName);
            }
        },
    });


    return LoginView;
});