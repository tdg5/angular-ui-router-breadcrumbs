breadcrumbs.directive('breadcrumbs', [
  '$compile',
  '$rootScope',
  'breadcrumbs',
  function($compile, $rootScope, breadcrumbs) {
    'use strict';

    return {
      link: {
        pre: function link(scope, element, attrs) {
          /* jshint unused: false */ /* for element, attrs */
          scope.breadcrumbs = breadcrumbs;
        }
      },
      restrict: 'AC'
    };
  }
]);
