/* globals performance */
(function (angular) {

  'use strict';

  var _el;
  function _setText(id, text) {
    if (_el[id]) {
      _el[id].textContent = text;
    }
  }

  var module = angular.module('performanceStatsModule', []);

  module.directive('performanceStats', [
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

      var _countScopesWatchers = function () {
        // This logic is borrowed from $digest(). Keep it in sync!
        var next, current, target = $rootScope;
        var scopes = 0,
          watchers = 0;

        current = target;
        do {
          scopes += 1;

          if (current.$$watchers) {
            watchers += current.$$watchers.length;
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $broadcast
          if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
            while(current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        } while ((current = next));

        return [scopes, watchers];
      };

      return {
        restrict: 'AE',
        replace: true,
        templateUrl: '/views/performance-stats.html',
        link: function (/* scope, elem, attrs */) {
          // Cache DOM elements
          _el = {
            '#scopes':         $document[0].querySelector('#scopes'),
            '#watchers':       $document[0].querySelector('#watchers'),
            '#dirty-checks':   $document[0].querySelector('#dirty-checks'),
            '#digest-cycles':  $document[0].querySelector('#digest-cycles'),
            '#digest-ms':      $document[0].querySelector('#digest-ms'),
            '#digest-fps':     $document[0].querySelector('#digest-fps'),
            '#avg-digest-ms':  $document[0].querySelector('#avg-digest-ms'),
            '#avg-digest-fps': $document[0].querySelector('#avg-digest-fps'),
            '#max-digest-ms':  $document[0].querySelector('#max-digest-ms'),
            '#max-digest-fps': $document[0].querySelector('#max-digest-fps'),

            '#head-load':      $document[0].querySelector('#head-load'),
            '#body-load':      $document[0].querySelector('#body-load'),
            '#footer-load':    $document[0].querySelector('#footer-load'),
            '#vendor-load':    $document[0].querySelector('#vendor-load'),
            '#app-load':       $document[0].querySelector('#app-load'),
            '#time-to-eop':    $document[0].querySelector('#time-to-eop'),
            '#time-to-ng':     $document[0].querySelector('#time-to-ng')
          };

          _setText('#head-load', stats.headLoad.toFixed(1));
          _setText('#body-load', stats.bodyLoad.toFixed(1));
          _setText('#footer-load', stats.footerLoad.toFixed(1));
          _setText('#vendor-load', stats.vendorScriptLoad.toFixed(1));
          _setText('#app-load', stats.appLoad.toFixed(1));
          _setText('#time-to-eop', stats.TTLB.toFixed(1));
          _setText('#time-to-ng', stats.timeToAngular.toFixed(1));

          // If the browser doesn't support Web Performance API
          // (I'm looking at you, Safari), don't even try.
          if (performance != null) {
            var digestCycles = 0,
              digestStart = 0,
              sumDigestMs = 0,
              maxDigestMs = 0,
              dirtyChecks = 0;

            // $digest loop uses a reverse while.
            // Pushing onto the end of $$watchers array makes this run first...
            $rootScope.$$watchers.push({
              eq: false,
              last: null,
              fn: function () {},
              exp: function () {},
              get: function () {
                dirtyChecks++;

                // Only update digestStart if not set. This allows for multiple
                // iterations inside the "dirty loop."
                //
                // NOTE: This technique for timing the $digest cycles
                //       DOES NOT capture time spent processing the asyncQueue!
                if (digestStart === 0) {
                  // $log.debug('$rootScope.$watch: digestStart');
                  digestStart = performance.now();
                  digestCycles++;
                }

                // Schedules a one-shot callback after digest loop is clean
                $rootScope.$$postDigest(function () {
                  if (digestStart !== 0) {
                    var digestEnd = performance.now();
                    var digestMs = (digestEnd - digestStart);
                    _setText('#digest-ms', digestMs.toFixed(1));
                    _setText('#digest-fps', (1000/digestMs).toFixed(0));

                    maxDigestMs = Math.max(digestMs, maxDigestMs);
                    _setText('#max-digest-ms', maxDigestMs.toFixed(1));
                    _setText('#max-digest-fps', (1000/maxDigestMs).toFixed(0));

                    sumDigestMs += digestMs;
                    if (digestCycles > 0) {
                      var avgDigestMs = sumDigestMs / digestCycles;
                      _setText('#avg-digest-ms', avgDigestMs.toFixed(1));
                      _setText('#avg-digest-fps', (1000/avgDigestMs).toFixed(0));
                    }

                    _setText('#dirty-checks', dirtyChecks);
                    _setText('#digest-cycles', digestCycles);

                    var count = _countScopesWatchers();
                    var scopes = count[0],
                      watchers = count[1];

                    _setText('#scopes', scopes);
                    _setText('#watchers', watchers);

                    var log = 'NG-PERF: Digest Cycle #' + digestCycles + ': ' + digestMs.toFixed(1) + ' ms, '+
                      'Scopes: ' + scopes + ', Watchers: ' + watchers +
                      ' [Overhead: ' + (performance.now() - digestEnd).toPrecision(3) + ' ms]';
                    $log.debug(log);
                    if ($window.console.timeStamp) {
                      $window.console.timeStamp(log);
                    }

                    // Register an async function to run first.
                    //
                    // NOTE: This technique for timing the $digest cycles
                    //       DOES capture time spent processing the asyncQueue!
                    $rootScope.$$asyncQueue.unshift({
                      scope: $rootScope,
                      expression: function (scope) {
                        // $log.debug('$rootScope.$evalAsync: digestStart');
                        digestStart = performance.now();
                        digestCycles++;
                      }
                    });

                    // Clear digestStart for next "dirty loop."
                    digestStart = 0;
                  }
                });

                return null;
              }
            });
          }
        }
      };
    }
  ]);

})(angular);

