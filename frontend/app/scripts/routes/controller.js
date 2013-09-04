/*global define*/

define([
    'backbone.marionette',
    'models/schedule',
    'collections/schedules',
    'views/schedules',
    'views/login',
    'views/navbar',
    'views/scheduleDetail',
    'views/sidebar',
    'views/scheduleUploadCsv',
    'communicator',
], function(Backbone, ScheduleModel, SchedulesCollection, SchedulesView,
            LoginView, NavbarView, ScheduleDetailView, SidebarView,
            ScheduleUploadCsvView, Communicator) {
    'use strict';

    var RouteController = Backbone.Marionette.Controller.extend({
        _navbarRegion: function() {
            return Communicator.reqres.request("RegionManager:getRegion",
                                               "navbar");
        },
        _mainRegion: function() {
            return Communicator.reqres.request("RegionManager:getRegion",
                                               "content");
        },
        _sidebarRegion: function() {
            return Communicator.reqres.request("RegionManager:getRegion",
                                               "sidebar");
        },
        maybeRedirectToLogin: function() {
            var isUserAuthenticated =
              Communicator.reqres.request("SessionManager:isUserAuthenticated");
            isUserAuthenticated.done(function(response) {
                if (response.is_user_authenticated === false) {
                    Backbone.history.navigate('#login', {trigger: true});
                    return true;
                }
                return false;
            });
        },
        view_schedule: function(slug) {
            console.log("RouterController schedule. slug: " + slug);
            var scheduleModel = new ScheduleModel({'slug': slug});
            var scheduleDetailView = new ScheduleDetailView({
                model: scheduleModel,
            });
            var navbarView = new NavbarView();
            var sidebarView = new SidebarView({
                model: scheduleModel,
            });

            this._mainRegion().close();
            this._navbarRegion().close();
            this._sidebarRegion().close();
            this._handleSyncError(scheduleModel);
            var that = this;
            scheduleModel.fetch({
                success: function() {
                    that._mainRegion().show(scheduleDetailView);
                    that._navbarRegion().show(navbarView);
                    that._sidebarRegion().show(sidebarView);
                },
            });  
        },
        upload_csv: function(slug) {
            console.log("RouterController upload_csv. slug: " + slug);
            var scheduleModel = new ScheduleModel({'slug': slug});
            var scheduleUploadCsvView = new ScheduleUploadCsvView({
                model: scheduleModel,
            });
            var navbarView = new NavbarView();
            var sidebarView = new SidebarView({
                model: scheduleModel,
                highlightUploadCsv: true,
            });

            this._mainRegion().close();
            this._navbarRegion().close();
            this._sidebarRegion().close();
            this._handleSyncError(scheduleModel);
            var that = this;
            scheduleModel.fetch({
                success: function() {
                    that._mainRegion().show(scheduleUploadCsvView);
                    that._navbarRegion().show(navbarView);
                    that._sidebarRegion().show(sidebarView);
                },
            });  
        },
        index: function() {
            console.log("RouterController index");
            Backbone.history.navigate('#schedules', {trigger: true});
        },
        login: function() {
            this._navbarRegion().close();
            this._sidebarRegion().close();
            this._mainRegion().show(new LoginView());
        },
        schedules: function() {
            var schedulesCollection = new SchedulesCollection();
            var schedulesView = new SchedulesView({
                collection: schedulesCollection
            });
            var navbarView = new NavbarView();
            var sidebarView = new SidebarView({
                hidden: true,
            });

            this._mainRegion().close();
            this._navbarRegion().close();
            this._sidebarRegion().close();
            this._handleSyncError(schedulesCollection);
            var that = this;
            schedulesCollection.fetch({
                success: function() {
                    that._mainRegion().show(schedulesView);
                    that._navbarRegion().show(navbarView);
                    that._sidebarRegion().show(sidebarView);
                },
            });
        },
        _handleSyncError: function(model) {
            this.listenTo(model, 'error', function(model, xhr, options) {
                console.log("error while syncing.");
                if (xhr.status == 401) {
                    console.log("unauthorized, redirect");
                    localStorage.setItem('urlAfterLogin',
                                         '#' + _.last(window.location.href.split('#')));
                    Backbone.history.navigate('#login', {trigger: true});
                }
            });
        },
    });

    return RouteController;
});
