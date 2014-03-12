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
var _ = require('lodash');

var navigation = require('../lib/navigation');

// stolen from Assembles collection_test.js
var getJson = function(file) {
  return grunt.file.readJSON(path.join('./test/fixtures/', file));
};

// the tests
describe('assemble-navigation', function() {

  before(function(){
    // run any code before tests here
  });

  it('navigation.build() should return a navigation object', function() {
    var expected = {main:{items:[]}};
    var input = getJson('scratch/sparse.json');
    var actual = navigation.build(input);
    expect(actual).to.eql(expected);
  });

  it('navigation.build() should populate options', function() {
    var expected = {main:{items:[]}};
    var input = getJson('scratch/sparse.json');
    var actual = navigation.build(input);
    expect(navigation.options).to.eql(expected);
  });

  it('custom-nav-config', function() {
    //var expected = getJson('expected/custom-nav-config.json');
    var input = getJson('inputs/custom-nav-config.json');
    var actual = navigation.build(input);
    //expect(navigation.options).to.eql(expected.assemble.options);
    expect(navigation.options).to.include.key('foot');
  });

  it('Should add pages to main', function() {
    var expected = getJson('expected/custom-nav-config.json');
    var input = getJson('inputs/assemble-post-pages.json');
    var actual = navigation.build(input);
    //expect(navigation.options).to.eql(expected.assemble.options);
    expect(actual).to.include.key('main');
  });

  it('Should add pages to asside', function() {
    var expected = getJson('expected/custom-nav-config.json');
    var input = getJson('inputs/assemble-post-pages.json');
    // make asside the default menu
    input.assemble.options.navigation.asside.default = true;
    var actual = navigation.build(input);
    //expect(navigation.options).to.eql(expected.assemble.options);
    //expect(actual).to.include.key('main');
    expect(navigation.defaultMenu).to.eql('asside');
    expect(actual.asside.items).to.have.length.above(2);
  });

  it('About should be in footer menu', function() {
    var expected = getJson('expected/custom-nav-config.json');
    var input = getJson('inputs/assemble-post-pages.json');
    // set menu option for about.hbs
    _(input.assemble.options.pages).find({basename:'about'}).data['menu'] = 'footer';

    var actual = navigation.build(input);
    expect(actual.footer.items).to.have.length.above(0);
  });

  it('About should be in main AND footer menu', function() {
    var expected = getJson('expected/custom-nav-config.json');
    var input = getJson('inputs/assemble-post-pages.json');
    // set menu option for about.hbs
    _(input.assemble.options.pages).find({basename:'about'}).data['menu'] = ['main', 'footer'];

    var actual = navigation.build(input);
    expect(actual.footer.items).to.have.length.above(0);
    var about = _(actual.main.items).find({title:'about this site'});
    expect(about).to.have.ownProperty('url');
  });




});