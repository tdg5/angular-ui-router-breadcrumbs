'use strict';

describe('Directive: breadcrumbs', function () {

  var $stateProvider,
    element,
    scope,
    states = {
      'b': {breadcrumb: 'B', url: '/b'},
      'b.b': {breadcrumb: 'BB', url: '/b'},
      'b.b.b': {url: '/b'},
      'b.b.b.b': {breadcrumb: 'BBBB', url: '/b'}
    };


  beforeEach(function() {
    module('ui.router', function(_$stateProvider_) {
      $stateProvider = _$stateProvider_;
      for(var state in states) {
        $stateProvider.state(state, states[state]);
      }
    });
    module('ui.router.breadcrumbs');
  });


  beforeEach(inject(function($rootScope, $state) {
    scope = $rootScope.$new();
    $state.transitionTo('b.b.b.b', {});
    element = '<ol breadcrumbs><li ng-repeat="breadcrumb in breadcrumbs">' +
      '<a ui-sref="{{breadcrumb.stateName}}">{{breadcrumb.text}}</a></li></ol>';
  }));


  it('should make the breadcrumbs service available to the elements scope', inject(function($compile, breadcrumbs) {
    var compiled = $compile(element)(scope);
    expect(scope.breadcrumbs).toBeDefined();
    expect(scope.breadcrumbs).toEqual(breadcrumbs);
  }));


  it('should compile the template such that ui-router directives work', inject(function($compile, breadcrumbs) {
    var items,
      anchors,
      href = '#/b',
      compiled = $compile(element)(scope);

    scope.$apply();
    items = compiled.children();
    expect(items.length).toBe(breadcrumbs.length);
    anchors = items.children();
    for(var i = 0; i < anchors.length; i++) {
      expect(anchors[i].text).toEqual(breadcrumbs[i].text);
      expect(anchors[i].attributes['ui-sref'].value).toEqual(breadcrumbs[i].stateName);
      expect(anchors[i].attributes['href'].value).toEqual(href);
      // Skip third url tier w/o breadcrumb
      href += href == '#/b/b' ? '/b/b' : '/b';
    }
  }));
});
