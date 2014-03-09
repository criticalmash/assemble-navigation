/*
 * assemble-contrib-navigation
 * https://github.com/criticalmash/assemble-plugin-menuing.git
 *
 * Copyright (c) 2014 criticalmash
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),

    /**
     * Configure jshint to check our javascript files
     */
    jshint: {
      all: ['Gruntfile.js', 'test/*.js', '*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    /**
     * Run mocha tests.
     */
    mochaTest: {
      test: {
        options: {
          spawn: false,
          clearRequireCache: true,
          reporter: 'progress'
        },
        src: ['test/*_test.js']
      }
    },

    /**
     * Watch source files and run tests when changes are made.
     */
    watch: {
      dev: {
        files: ['Gruntfile.js', 'test/*.js', '*.js'],
        tasks: ['test']
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Tests
  grunt.registerTask('test', ['jshint', 'mochaTest']);

  // Dev
  grunt.registerTask('dev', ['test', 'watch']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};