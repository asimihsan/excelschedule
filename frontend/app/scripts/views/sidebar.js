/*global define*/

define([
    'jquery',
    'lodash',
    'backbone.marionette',
    'templates',
    'communicator',
], function ($, _, Backbone, JST, Communicator) {
    'use strict';

    var SidebarView = Backbone.Marionette.ItemView.extend({
        template: JST['app/scripts/templates/sidebar.ejs'],
        tagName: 'ul',
        className: 'nav nav-list well',
        ui: {
            upload_csv: 'li.upload_csv',
        },
        events: {
            'click a.upload_csv': function(e) {
                e.preventDefault();
                Backbone.history.navigate($(e.target).attr('href')
                                                     .replace(/^\/?#/, ''),
                                         {trigger: true});
            }
        },

        initialize: function(options) {
            this.options = _.clone(options || {});
            _.defaults(this.options, {
                hidden: false,
                highlightUploadCsv: false,
            });
        },
        onRender: function() {
            if (this.options.hidden === true) {
                $("#sidebar").hide();
            } else {
                $("#sidebar").show();
            }
            if (this.options.highlightUploadCsv === true) {
                this.ui.upload_csv.addClass("active");
            } else {
                this.ui.upload_csv.removeClass("active");
            }
        },        
    });

    return SidebarView;
});