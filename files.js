breadcrumbFiles = {
  src: [
    'src/ui-router-breadcrumbs.js',
    'src/services/breadcrumbs.js'
  ],
  testUtils: [
    'bower_components/angular-mocks/angular-mocks.js'
  ],
  test: [
    "test/**/*Spec.js"
  ],
  angular: [
    "bower_components/angular/angular.js",
    "bower_components/angular-ui-router/release/angular-ui-router.js"
  ]
};

if (exports) {
  exports.files = breadcrumbFiles;
}
