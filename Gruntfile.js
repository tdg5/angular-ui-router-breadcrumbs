'use strict';
/* global module, require */

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  var files = require('./files').files;

  grunt.initConfig({
    builddir: 'build',
    buildtag: '-dev-' + grunt.template.today('yyyy-mm-dd'),
    clean: [ '<%= builddir %>' ],
    concat: {
      options: {
        banner: '<%= meta.banner %>\n\n'+
                '(function (window, angular, undefined) {\n'+
                '"use strict";\n',
        footer: '})(window, window.angular);',
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        },
      },
      build: {
        src: files.src,
        dest: '<%= builddir %>/<%= pkg.name %>.js'
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dest: 'dist',
          filter: 'isFile',
          flatten: true,
          src: ['build/*.js']
        }]
      }
    },
    jshint: {
      beforeConcat: {
        src: ['Gruntfile.js', 'src/**/*.js']
      },
      afterConcat: {
        src: [ '<%= concat.build.dest %>' ]
      },
      options: {
        boss: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        globalstrict: true,
        globals: {
          angular: true
        },
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        unused: true,
      }
    },
    karma: {
      unit: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/src.conf.js',
        singleRun: true
      },
      debug: {
        singleRun: false,
        background: false,
        configFile: 'config/karma/src.conf.js',
        browsers: [ grunt.option('browser') || 'Chrome' ]
      },
      build: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/build.conf.js',
        singleRun: true
      },
      min: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/min.conf.js',
        singleRun: true
      }
    },
    meta: {
      banner: '/**\n' +
        ' * <%= pkg.description %>\n' +
        ' * @version v<%= pkg.version %><%= buildtag %>\n' +
        ' * @link <%= pkg.homepage %>\n' +
        ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
        ' */'
    },
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '<%= meta.banner %>\n'
      },
      build: {
        files: {
          '<%= builddir %>/<%= pkg.name %>.min.js': ['<banner:meta.banner>', '<%= concat.build.dest %>']
        }
      }
    },
    watch: {
      files: ['src/*.js', 'test/**/*.js'],
      tasks: ['build']
    },
  });

  grunt.registerTask('default', ['karma:unit', 'build']);
  grunt.registerTask('build', 'Perform a normal build', ['jshint:beforeConcat', 'concat', 'jshint:afterConcat', 'karma:build', 'uglify', 'karma:min']);
  grunt.registerTask('dist', 'Perform a clean build', ['clean', 'build', 'copy:dist']);
};
