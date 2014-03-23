'use strict';

describe('Service: Breadcrumbs', function() {

  var breadcrumbs,
    $stateProvider,
    initStateTo,
    breadcrumbStates = {
      'b': {breadcrumb: 'B'},
      'b.b': {breadcrumb: 'BB'},
      'bx': {parent: 'b.b', breadcrumb: 'BX'},
      'b.b.b': {},
      'b.b.b.b': {breadcrumb: 'BBBB'}
    },
    breadcrumbStatesLength = (function() {
      var i = 0;
      for(var attr in breadcrumbStates) { i++; };
      return i
    })(),
    states = {
      'a': {},
      'a.a': {},
      'ax': {parent: 'a.a'}
    };


  angular.extend(states, breadcrumbStates);

  beforeEach(function() {
    module('ui.router', function(_$stateProvider_) {
      $stateProvider = _$stateProvider_;
      for(var state in states) {
        $stateProvider.state(state, states[state]);
      }
    });
    module('ui.router.breadcrumbs');
  });


  describe('Default compiler', function() {

    beforeEach(function() {
      inject(function (_breadcrumbs_, $state, $rootScope) {
        breadcrumbs = _breadcrumbs_;
        initStateTo = defInitStateTo($state, $rootScope);
      })
    });


    it('should return an empty breadcrumb array for state branch w/o breadcrumbs', function() {
      initStateTo('ax');
      expect(breadcrumbs.length).toBe(0);
    });


    it('should return expected breadcrumb array for state branch w/ breadcrumbs', function() {
      initStateTo('bx');
      var crumb,
        breadcrumbState,
        statesToSkip = /b\.b\./;

      expect(breadcrumbs.length).toBe(3);
      for(var state in breadcrumbStates) {
        if(statesToSkip.test(state)) { continue; };

        breadcrumbState = breadcrumbStates[state];
        crumb = breadcrumbs.shift();
        expect(crumb.text).toBe(breadcrumbState.breadcrumb);
        expect(crumb.stateName).toBe(breadcrumbState.name);
      }
    });


    it('should update breadcrumbs on successful state change', function() {
      initStateTo('ax');
      expect(breadcrumbs.length).toBe(0);
      initStateTo('bx');
      expect(breadcrumbs.length).toBe(3);
      initStateTo('ax');
      expect(breadcrumbs.length).toBe(0);
    });


    it('should not create breadcrumbs for states w/o breadcrumbs between breadcrumb states', function() {
      initStateTo('b.b.b.b');
      expect(breadcrumbs.length).toBe(3);
      var statesToCheck = /(^b$|^b\.)/,
      breadcrumbState, crumb;
      for(var state in breadcrumbStates) {
        breadcrumbState = breadcrumbStates[state];
        if(statesToCheck.test(state) && breadcrumbState.breadcrumb) {
          crumb = breadcrumbs.shift();
          expect(crumb.text).toBe(breadcrumbState.breadcrumb);
          expect(crumb.stateName).toBe(breadcrumbState.name);
        }
      }
    });

  });

  describe('Custom compiler', function() {

    var spy,
      test = {
        customCompiler: function(currentState) {
          var breadcrumb = currentState.breadcrumb;
          if(breadcrumb == 'B') {
            return null;
          } else {
            return { text: breadcrumb };
          }
        }
      };


    beforeEach(function() {
      var fakeModule = angular.module('test.provider.config', []);
      spy = spyOn(test, 'customCompiler').and.callThrough();
      fakeModule.config(function(breadcrumbsProvider) {
        breadcrumbsProvider.compileWith(test.customCompiler);
      });
      module('test.provider.config');
      inject(function (_breadcrumbs_, $state, $rootScope) {
        breadcrumbs = _breadcrumbs_;
        initStateTo = defInitStateTo($state, $rootScope);
      })
    });


    it('should call the custom compile method', function() {
      expect(spy).not.toHaveBeenCalled();
      initStateTo('b');
      expect(spy).toHaveBeenCalled();
    });


    it('should ignore breadcrumbs that compile to null', function() {
      initStateTo('b');
      expect(breadcrumbs.length).toBe(0);
    });


    it('should update breadcrumbs on successful state change', function() {
      expect(spy).not.toHaveBeenCalled();
      initStateTo('bx');
      expect(spy).toHaveBeenCalled();
    });

  });

});
