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

            var monthsToDisplay = 2,
                ol = document.getElementById('months'),
                transitionEnd = transitionEnd();

            scope.months = dateUtils.getVisibleMonths();
            scope.weekdays = scope.weekdays || dateUtils.getDaysOfWeek();
            scope.limitIndex = monthsToDisplay;
            scope.limitTrailer = -1*monthsToDisplay;
            scope.animating = false;

            ol.addEventListener(transitionEnd, onTransitionEnd);

            scope.next = function(){

                scope.limitIndex++;
                scope.limitTrailer = -1*(monthsToDisplay+1);

                scope.animating = true;
                ol.style.left = '-52%'; // make dynamic based on halfs

                if (!transitionEnd){
                    onTransitionEnd();
                }
            };

            scope.prev = function(){

                scope.limitTrailer = -1*(monthsToDisplay+1);
                ol.style.left = '-52%';


                $timeout(function(){
                    scope.animating = true;
                    ol.style.left = '0%';
                });

                if (!transitionEnd){
                    onTransitionEnd();
                }
            };

            scope.displayDay = function(d, f, l) {
              return (!(f && d.getDate() > 7) && !(l && d.getDate() < 14)) ? d.getDate() : '-';
            };

            function onTransitionEnd(){
                scope.$apply(function(){
                    scope.animating = false;
                    scope.limitTrailer = -1*monthsToDisplay;
                    if (ol.style.left === '0%'){
                        scope.limitIndex--;
                    } else {
                        ol.style.left = '0%';
                    }

                });
            }

            function transitionEnd() {
                var el = document.createElement('div');

                var transEndEventNames = {
                    WebkitTransition : 'webkitTransitionEnd',
                    MozTransition    : 'transitionend',
                    OTransition      : 'oTransitionEnd otransitionend',
                    transition       : 'transitionend'
                };

                for (var name in transEndEventNames) {
                    if (el.style[name] !== undefined) {
                        return transEndEventNames[name];
                    }
                }

                return false;
            }
        }
    };
});
