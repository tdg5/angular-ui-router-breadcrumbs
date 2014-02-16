'use strict';

function $get(what) {
  return jasmine.getEnv().currentSpec.$injector.get(what);
};


function initStateTo(state, optionalParams) {
  var $state = $get('$state');
  $state.transitionTo(state, optionalParams || {});
  $get('$rootScope').$apply();
  expect($state.current.name).toBe(state);
};
