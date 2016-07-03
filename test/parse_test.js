/*
 * Assemble Plugin: assemble-navigation
 * https://github.com/criticalmash/assemble-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 *
 * Tests for assemble-navigation v0.2.0 parsePages method
 *
 * 
 * Copyright (c) 2016 criticalmash
 * Licensed under the MIT license.
 */

// node builtins
var path = require('path');

// npm modules
var expect = require('chai').expect;
var _ = require('lodash');

var assemble = require('assemble');
var app;
var navi = require('../lib/navigation');


// the tests
describe('parsePages', function() {

  beforeEach(function(){
    // setup assemble
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
    // reset configuration
    navi.configuration();
    // connect parsePages() middleware
    app.pages.onLoad(/\.hbs$/, navi.parsePages());
  });

  describe('add pages', function() {
    it('pages should be added to nav as they are loaded', function() {
      app.pages({
        'a.hbs': {path: 'a.hbs', contents: new Buffer('a')},
        'b.hbs': {path: 'b.hbs', contents: new Buffer('b')},
        'c.hbs': {path: 'c.hbs', contents: new Buffer('c')},
      });
      //console.log('navigation', navi.navigation);
      expect(navi.navigation.main.items.length).to.eql(3);
    });
  });

  describe('add index', function() {
    it('home pages should have an id of main-index', function() {
      app.pages({
        'index.hbs': {path: 'index.hbs', contents: new Buffer('home page')}
      });
      //console.log('navigation', navi.navigation);
      expect(navi.navigation.main.items[0].linkId).to.eql('main-index');
    });
  });

  describe('add parent', function() {
    it('a directories index page should be in the top level nav', function() {
      app.pages({
        'sub/index.hbs': {path: 'sub/index.hbs', contents: new Buffer('index page')},
        'sub/b.hbs': {path: 'sub/b.hbs', contents: new Buffer('another page')}
      });
      //console.log('navigation', JSON.stringify(navi.navigation, null, '\t'));
      expect(navi.navigation.main.items[0].linkId).to.eql('main-sub');
    });
    it('a child page belongs in the parents items array', function(){
      app.pages({
        'sub/index.hbs': {path: 'sub/index.hbs', contents: new Buffer('index page')},
        'sub/b.hbs': {path: 'sub/b.hbs', contents: new Buffer('another page')}
      });
      //console.log('navigation', JSON.stringify(navi.navigation, null, '\t'));
      expect(navi.navigation.main.items[0].items[0].linkId).to.eql('main-sub-b');
    });
  });


});