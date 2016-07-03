/**
 *  Tests for generateLinkId() function
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
var generateLinkId = navi._testMethods().generateLinkId;

// the tests
describe('generateLinkId', function() {
  beforeEach(function(){
    // setup assemble
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
    navi.configuration();
  });

  
  describe('test homepage', function() {
    it('should use main-index for home page id', function() {
      var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var linkId = generateLinkId(page, 'main');
      //console.log('menu item', JSON.stringify(item, null, '\t'));

      expect(linkId).to.eql('main-index');
    });
  });

  describe('test tertiary directories', function() {
    it('should use proper id for sub-directories', function() {
      var page = app.page('index.hbs', {path: 'media/news/latest_news.hbs', contents: new Buffer('---\ntitle: Latest News\n---Here`s some news')});
      var linkId = generateLinkId(page, 'main');
      
      expect(linkId).to.eql('main-media-news-latest-news');
    });
  });
});