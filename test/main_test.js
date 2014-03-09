/*
 * Assemble Plugin: assemble-contrib-navigation
 * https://github.com/criticalmash/assemble-contrib-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 *
 * Copyright (c) 2014 criticalmash
 * Licensed under the MIT license.
 */

var expect = require('chai').expect;

var navigation = require('../lib/navigation');

describe('assemble-contrib-navigation', function() {

  before(function(){
    // run any code before tests here
  });

  it('should do something awesome', function() {
    var expected = 'assemble-contrib-navigation';
    var actual = 'assemble-contrib-navigation';
    expect(actual).to.eql(expected);
  });

});