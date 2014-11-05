'use strict';

/**
 * @ngdoc directive
 * @name angularcalendarApp.directive:performanceStats
 * @description
 * # performanceStats
 */
angular.module('angularcalendarApp')
  .directive('performanceStats', [
    '$log',
    '$window',
    '$document',
    '$rootScope',

    function ($log, $window, $document, $rootScope) {
      var ngStart = (performance != null) ? performance.now() : 0;
      var stats = {
        headStart: ($window.perfStats && $window.perfStats.headStart) || 0,
        headLoad: ($window.perfStats && $window.perfStats.headLoad) || 0,
        bodyLoad: ($window.perfStats && $window.perfStats.bodyLoad) || 0,
        footerLoad: ($window.perfStats && $window.perfStats.footerLoad) || 0,
        vendorScriptLoad: ($window.perfStats && $window.perfStats.vendorScriptLoad) || 0,
        appLoad: ($window.perfStats && $window.perfStats.appLoad) || 0,
        TTLB: ($window.perfStats && $window.perfStats.TTLB) || 0
      };

      stats.timeToAngular = (ngStart - stats.headStart);

      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'views/performance-stats.html',
        link: function (/* scope, elem, attrs */) {

          // If the browser doesn't support Web Performance API
          // (I'm looking at you, Safari), don't even try.
          if (performance != null) {
            var digestCycles = 0,
              digestStart = 0,
              sumDuration = 0,
              maxDuration = 0,
              dirtyChecks = 0;

            // NOTE: This technique for timing the $digest cycles does
            //       NOT capture time spent processing the asyncQueue!

            // $digest loop uses a reverse while.
            // Pushing onto the end of $$watchers array makes this run first...
            $rootScope.$$watchers.push({
              get: function () {
                dirtyChecks++;
                // $log.debug('PERF: Dirty Checks:', dirtyChecks);

                // Only update digestStart if not set. This allows for multiple
                // iterations inside the "dirty loop."
                if (digestStart === 0) {
                  digestStart = performance.now();
                  digestCycles++;
                }

                // Schedules a one-shot callback after digest loop is clean
                $rootScope.$$postDigest(function () {
                  if (digestStart !== 0) {
                    var digestEnd = performance.now();
                    var duration = (digestEnd - digestStart);
                    angular.element($document[0].querySelector('#duration')).text(duration.toFixed(1));
                    angular.element($document[0].querySelector('#digest-fps')).text((1000/duration).toFixed(0));

                    maxDuration = Math.max(duration, maxDuration);
                    angular.element($document[0].querySelector('#max-duration')).text(maxDuration.toFixed(1));
                    angular.element($document[0].querySelector('#max-digest-fps')).text((1000/maxDuration).toFixed(0));

                    sumDuration += duration;
                    if (digestCycles > 0) {
                      var avgDuration = sumDuration / digestCycles;
                      angular.element($document[0].querySelector('#avg-duration')).text(avgDuration.toFixed(1));
                      angular.element($document[0].querySelector('#avg-digest-fps')).text((1000/avgDuration).toFixed(0));
                    }

                    angular.element($document[0].querySelector('#dirtychecks')).text(dirtyChecks);
                    angular.element($document[0].querySelector('#digest-cycles')).text(digestCycles);

                    $log.debug('PERF: Digest Cycle', ('#'+digestCycles+':'), duration.toFixed(1), 'ms', ' [Overhead:', (performance.now() - digestEnd).toPrecision(3), 'ms]');

                    // Clear digestStart for next "dirty loop."
                    digestStart = 0;
                  }
                });

                return null;
              },
              last: null,
              fn: function () {},
              exp: function () {},
              eq: false
            });

            angular.element($document[0].querySelector('#headLoad')).text(stats.headLoad.toFixed(1));
            angular.element($document[0].querySelector('#bodyLoad')).text(stats.bodyLoad.toFixed(1));
            angular.element($document[0].querySelector('#footerLoad')).text(stats.footerLoad.toFixed(1));
            angular.element($document[0].querySelector('#vendorScriptLoad')).text(stats.vendorScriptLoad.toFixed(1));
            angular.element($document[0].querySelector('#appLoad')).text(stats.appLoad.toFixed(1));
            angular.element($document[0].querySelector('#TTLB')).text(stats.TTLB.toFixed(1));
            angular.element($document[0].querySelector('#time-to-angular')).text(stats.timeToAngular.toFixed(1));
          }

          var countWatchers = function () {
            // var start = performance.now();
            var ngScopes = [];

            [].forEach.call(document.querySelectorAll('.ng-scope'), function (elem) {
              var s = angular.element(elem).scope();
              if (s) {
                ngScopes.push({ id: s.$id, watchCount: (s.$$watchers ? (s.$$watchers.length || 0) : 0) });
              }
            });

            var totalWatches = ngScopes.reduce(function (prev, cur) {
              return (prev.watchCount || prev) + cur.watchCount;
            });
            totalWatches -= 1;  // Ignore our own watcher

            angular.element($document[0].querySelector('#scopes')).text(ngScopes.length);
            angular.element($document[0].querySelector('#watchers')).text(totalWatches);

            // $log.debug('PERF: Scopes:', ngScopes.length, ', Watchers:', totalWatches, ' [Overhead:', (performance.now() - start).toPrecision(3), 'ms]');

            // Update every second...
            // Does not need to be $apply'd, so using setTimeout instead of $timeout
            setTimeout(countWatchers, 1000);
          };
          countWatchers();
        }
      };
    }
  ]);
