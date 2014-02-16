breadcrumbFiles = {
  angular: [
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js'
  ],
  build: [
    'build/*.min.js'
  ],
  src: [
    'src/ui-router-breadcrumbs.js',
    'src/services/breadcrumbs.js'
  ],
  test: [
    "test/**/*Spec.js"
  ],
  testUtils: [
    'bower_components/angular-mocks/angular-mocks.js',
    'test/testHelper.js'
  ]
};

if (exports) {
  exports.files = breadcrumbFiles;
}
