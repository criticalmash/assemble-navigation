/**
 *  Tests for findMenuPath() function
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
var findMenuPath = navi._testMethods().findMenuPath;

// the tests
describe('findMenuPath', function() {
  beforeEach(function(){
    // setup assemble
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
    navi.configuration();
  });

  
  describe('path starts at root', function() {
    it('Filepath for home pages should start at web site root', function() {
      var pages = app.pages('test/fixtures/findmenupath/**/*.hbs');
      //console.log('pages', JSON.stringify(app.views.pages, null, '\t'));

      var indexPage = _.find(pages, function(o){
        return o.stem = 'index';
      });

      //console.log('indexPage', indexPage);

      var path = findMenuPath(indexPage);
      //console.log(path);
      expect(path).to.eql(['.']);
    });
  });
});