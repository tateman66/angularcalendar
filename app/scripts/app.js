'use strict';

/**
 * @ngdoc overview
 * @name angularcalendarApp
 * @description
 * # angularcalendarApp
 *
 * Main module of the application.
 */
angular.module('angularcalendarApp', [
  'ngRoute',
  'pasvaz.bindonce'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
