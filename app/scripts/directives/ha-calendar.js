'use strict';

/**
 * @ngdoc directive
 * @name angularcalendarApp.directive:haCalendar
 * @description
 * # haCalendar
 */
angular.module('angularcalendarApp')
.directive('haCalendar', function (dateUtils) {
    return {
        templateUrl: 'views/ha-calendar.html',
        restrict: 'E',
        link: function(scope){
            scope.months = dateUtils.getVisibleMonths();
            //scope.weeks = dateUtils.getVisibleWeeks(new Date());

            scope.weekdays = scope.weekdays || dateUtils.getDaysOfWeek();
        }
    };
});
