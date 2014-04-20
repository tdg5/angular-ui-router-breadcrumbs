/**
 * angular-ui-router state derived breadcrumbs
 * @version v0.0.1-dev-2014-04-20
 * @link https://github.com/interval-braining/angular-ui-router-breadcrumbs
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (window, angular, undefined) {
"use strict";
// Source: src/ui_router_breadcrumbs.js
/* exported breadcrumbs */
var breadcrumbs = angular.module('ui.router.breadcrumbs', ['ng', 'ui.router']);

// Source: src/directives/breadcrumbs.js
breadcrumbs.directive('breadcrumbs', [
  '$compile',
  '$rootScope',
  'breadcrumbs',
  function($compile, $rootScope, breadcrumbs) {
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

// Source: src/services/breadcrumbs.js
breadcrumbs.provider('breadcrumbs', function BreadcrumbsProvider() {
var compile;

  function defaultCompiler(currentState) {
    if(!currentState.breadcrumb) { return null; }

    if(typeof currentState.breadcrumb === 'string') {
      return {
        text: currentState.breadcrumb,
        stateName: currentState.name
      };
    } else {
      return currentState.breadcrumb;
    }
  }

  compile = defaultCompiler;

  function refresh($state, breadcrumbs) {
    var currentState = $state.$current,
      breadcrumb;

    breadcrumbs.length = 0;

    while(currentState.parent) {
      breadcrumb = compile(currentState.self);
      if(breadcrumb) { breadcrumbs.unshift(breadcrumb); }
      currentState = currentState.parent;
    }
    return breadcrumbs;
  }

  // Public Interface

  this.compileWith = function(customCompiler) {
    return compile = customCompiler || defaultCompiler;
  };

  this.$get = [
    '$rootScope',
    '$state',
    function($rootScope, $state) {
      var breadcrumbs = [];
      refresh($state, breadcrumbs);
      $rootScope.$on('$stateChangeSuccess', function() { refresh($state, breadcrumbs); });
      return breadcrumbs;
    }
  ];
});
})(window, window.angular);