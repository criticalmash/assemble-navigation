/*
 * Assemble Plugin: assemble-navigation
 * https://github.com/criticalmash/assemble-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 *
 * Copyright (c) 2014 criticalmash
 * Licensed under the MIT license.
 */

// node builtins
var path = require('path');

// npm modules
var expect = require('chai').expect;
var grunt = require('grunt');

var navigation = require('../lib/navigation');

// stolen from Assembles collection_test.js
var getJson = function(file) {
  return grunt.file.readJSON(path.join('./test/fixtures/scratch/', file));
};

// the tests
describe('assemble-navigation', function() {

  before(function(){
    // run any code before tests here
  });

  it('should do something awesome', function() {
    var expected = 'assemble-navigation';
    var actual = 'assemble-navigation';
    expect(actual).to.eql(expected);
  });

  it('navigation.build() should return a navigation object', function() {
    var expected = {main:[]};
    var input = getJson('sparse.json');
    var actual = navigation.build(input);
    expect(actual).to.eql(expected);
  });

});