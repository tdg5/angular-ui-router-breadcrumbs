'use strict';

function defInitStateTo($state, $rootScope) {
  return function(state, optionalParams) {
    $state.transitionTo(state, optionalParams || {});
    $rootScope.$apply();
    expect($state.current.name).toBe(state);
  };
}
