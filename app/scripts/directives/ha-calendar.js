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
            scope.weekdays = scope.weekdays || dateUtils.getDaysOfWeek();
            var limitToVal = 2;

            scope.limitToValue = function(){
                return limitToVal;
            };

            scope.increaseLimit = function(){
                limitToVal+= 2;
            };
        }
    };
});
