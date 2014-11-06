'use strict';

/**
 * @ngdoc directive
 * @name angularcalendarApp.directive:haCalendar
 * @description
 * # haCalendar
 */
angular.module('angularcalendarApp')
  .directive('haCalendar', function (dateUtils, $timeout) {
    return {
      templateUrl: 'views/ha-calendar.html',
      restrict: 'E',
      link: function(scope){
        scope.months = dateUtils.getVisibleMonths();
        scope.weekdays = scope.weekdays || dateUtils.getDaysOfWeek();
        scope.limitIndex = 2;
        scope.limitTrailer = 2;

        var monthsToDisplay = 2;

        scope.next = function(){


          scope.limitIndex++;
          scope.limitTrailer = -1*monthsToDisplay;
        };

        scope.prev = function(){


          scope.limitIndex--;
          scope.limitTrailer = (scope.limitIndex !== monthsToDisplay) ? -1*monthsToDisplay : monthsToDisplay;
        };

        scope.displayDay = function(d, f, l) {
          if ((!(f && d.getDate() > 7)) &&
          (!(l && d.getDate() < 14))) {
            return d.getDate()
          } else {
            return '_';
          }

        }
      }
    };
  });
