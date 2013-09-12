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
            form: 'form',
        },
        events: {
            'submit form': 'submit',
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