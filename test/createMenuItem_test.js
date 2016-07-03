/**
 *  Tests for createMenuItem() function
 */
/*
 * Assemble Plugin: assemble-navigation
 * https://github.com/criticalmash/assemble-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 *
 * Tests for assemble-navigation v0.2.0
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
var createMenuItem = navi._testMethods().createMenuItem;

// the tests
describe('createMenuItem', function() {
  beforeEach(function(){
    // setup assemble
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
    navi.configuration();
  });

  
  describe('test defaults', function() {
    it('should have minimum default values', function() {
      var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var item = createMenuItem(page, 'main');
      //console.log('menu item', JSON.stringify(item, null, '\t'));

      expect(item.title).to.eql('index');
      expect(item.url).to.eql('/index.html');
      expect(item.linkId).to.eql('main-index');
    });
  });

  describe('test tertiary directories', function() {
    it('should use proper id and path for sub-directories', function() {
      var page = app.page('index.hbs', {path: 'media/news/latest-news.hbs', contents: new Buffer('---\ntitle: Latest News\n---Here`s some news')});
      var item = createMenuItem(page, 'main');
      //console.log('menu item', JSON.stringify(item, null, '\t'));
      //console.log('relative path', path.dirname(page.relative));

      expect(item.title).to.eql('Latest News');
      expect(item.url).to.eql('/media/news/latest-news.html');
      expect(item.linkId).to.eql('main-media-news-latest-news');
    });
  });
});