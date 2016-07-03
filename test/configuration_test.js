/*
 * Assemble Plugin: assemble-navigation
 * https://github.com/criticalmash/assemble-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 *
 * Tests for assemble-navigation v0.2.0
 *
 * 
 * Copyright (c) 2014 criticalmash
 * Licensed under the MIT license.
 */

// node builtins
var path = require('path');

// npm modules
var expect = require('chai').expect;
var _ = require('lodash');

var navigation = require('../lib/navigation');


// the tests
describe('configuration', function() {

  before(function(){
    // run any code before tests here
  });

  it('navigation.configuration() should create a default nav', function() {
    var expected = {main:{items:[]}};
    navigation.configuration();
    expect(navigation.navigation).to.eql(expected);
  });


  it('A custom config should create a custom navigation', function() {
    var expected = {main:{items:[]}, footer:{items:[]}};
    navigation.configuration(expected);
    expect(navigation.navigation).to.eql(expected);
  });

});