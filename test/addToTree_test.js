/**
 *  Tests for addToTree() function
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
var addToTree = navi._testMethods().addToTree;

// the tests
describe('addToTree', function() {
  this.timeout(0);
  beforeEach(function(){
    // setup assemble
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }

    app.pages.onLoad(/\.hbs$/, navi.parsePages());

    navi.configuration();
  });
  
  describe('test deep heirarchy', function() {
    this.timeout(0); // so we can debug this at our own pace
    it('Should handle heirarchies three levels deep', function() {
      this.timeout(0);
      var pages = app.pages('test/fixtures/addToTree/**/*.hbs');
      app.toStream('pages')
        .pipe(app.renderFile());
      //console.log('main menu', JSON.stringify(navi.navigation.main, null, '\t'));

      // find items under main-media
      var mediaMenuItem = _.find(navi.navigation.main.items, function(o){
        return o.linkId === 'main-media';
      });
      console.log('mediaMenuItem', JSON.stringify(mediaMenuItem, null, '\t'));
      expect(mediaMenuItem).to.have.ownProperty('items');
      expect(mediaMenuItem.items).to.have.length.above(0);
    });
  });

});


