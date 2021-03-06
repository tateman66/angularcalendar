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
  'pasvaz.bindonce',
  'performanceStatsModule',
  'ngTouch'
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
