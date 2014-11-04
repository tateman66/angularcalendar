'use strict';

/**
 * @ngdoc overview
 * @name angularcalendarApp
 * @description
 * # angularcalendarApp
 *
 * Main module of the application.
 */
angular
  .module('angularcalendarApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
