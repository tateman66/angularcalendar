'use strict';

describe('Controller: HaBookingWidgetCtrl', function () {

  // load the controller's module
  beforeEach(module('angularcalendarApp'));

  var HaBookingWidgetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HaBookingWidgetCtrl = $controller('HaBookingWidgetCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
