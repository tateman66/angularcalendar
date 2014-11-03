'use strict';

/**
 * @ngdoc directive
 * @name angularcalendarApp.directive:haCalendar
 * @description
 * # haCalendar
 */
angular.module('angularcalendarApp')
  .directive('haCalendar', function () {
    return {
      template: '<div>Calendar Directive</div>',
      restrict: 'E'
    };
  });
