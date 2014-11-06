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
            scope.limitIndex = 2;
            scope.limitTrailer = 2;
            scope.animating = false;

            var monthsToDisplay = 2,
                ol = document.getElementById('months'),
                transitionEnd = transitionEnd();

            scope.next = function(){

                scope.limitIndex++;
                scope.limitTrailer = -2;

                scope.animating = true;
                ol.style.left = '-52%';

                if (transitionEnd){
                    ol.addEventListener(transitionEnd, onTransitionEnd);
                } else {
                    onTransitionEnd();
                }
            };

            scope.prev = function(){
                scope.limitIndex--;
                scope.limitTrailer = scope.limitIndex;

                scope.animating = true;
                ol.style.left = '0%';

                if (transitionEnd){
                    ol.addEventListener(transitionEnd, onTransitionEnd);
                } else {
                    onTransitionEnd();
                }
            };

            scope.displayDay = function(d, f, l) {
              if ((!(f && d.getDate() > 7)) && (!(l && d.getDate() < 14))) {
                return d.getDate();
              } else {
                return '-';
              }
            };

            function onTransitionEnd(){
                return;
                scope.$apply(function(){
                    scope.animating = false;
                    scope.limitTrailer = -1*monthsToDisplay;
                    ol.style.left = '0%';
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

                return false; // explicit for ie8 (  ._.)
            }
        }
    };
});
