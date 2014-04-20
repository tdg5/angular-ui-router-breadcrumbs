var pkg = require('./package.json');

var pkgFiles = {
  build: [
    'build/*.min.js'
  ],
  karma: [
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'test/test_helper.js'
  ],
  'karma-build': [
    '@karma',
    'build/' + pkg.name + '.js',
    '@karma-tests'
  ],
  'karma-min': [
    '@karma',
    'build/' + pkg.name + '.min.js',
    '@karma-tests'
  ],
  'karma-src-exclude': [],
  'karma-src': [
    '@karma',
    'src/ui_router_breadcrumbs.js',
    'src/**/*.js',
    '@karma-tests'
  ],
  'karma-tests': [
    'test/**/*_test.js'
  ],
  src: [
    'src/ui_router_breadcrumbs.js',
    'src/directives/breadcrumbs.js',
    'src/services/breadcrumbs.js'
  ]
};

if (exports) {
  exports.files = pkgFiles;
  exports.mergeFilesFor = function() {
    var files = [];

    Array.prototype.slice.call(arguments, 0).forEach(function(filegroup) {
      pkgFiles[filegroup].forEach(function(file) {
        // replace @ref
        var match = file.match(/^\@(.*)/);
        if (match) {
          files = files.concat(pkgFiles[match[1]]);
        } else {
          files.push(file);
        }
      });
    });

    return files;
  };
}
