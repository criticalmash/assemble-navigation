/**
 *  Tests for getAssignedMenus() function
 */
/*
 * Assemble Plugin: assemble-navigation
 * https://github.com/criticalmash/assemble-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 *
 * Tests for assemble-navigation v0.2.0 getAssignedMenus method
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
var getAssignedMenus = navi._testMethods().getAssignedMenus;

// the tests
describe('getAssignedMenus', function() {
  beforeEach(function(){
    // setup assemble
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
    navi.configuration({defaultMenu:{items:[], default:true}, main:{items:[]}, footer:{items:[]}});
    //app.pages('test/fixtures/assignedmenus/*.hbs');
  });

  describe('uses default', function() {
    it('Files without a declared menu should use default menu', function() {
      //console.log('pages', JSON.stringify(app.views.pages, null, '\t'));
      //console.log('navigation', JSON.stringify(navi.navigation, null, '\t'));
      var defaultPage = app.page('test/fixtures/assignedmenus/a_default.hbs');
      //console.log('defaultPage', JSON.stringify(defaultPage.data, null, '\t'));

      var menus = getAssignedMenus(defaultPage);
      expect(menus).to.eql(['defaultMenu']);
    });
  });

  describe('uses assigned menu', function() {
    it('Files should use menu declared in frontmatter', function() {
      var main = app.page('test/fixtures/assignedmenus/b_main.hbs');

      var menus = getAssignedMenus(main);
      expect(menus).to.eql(['main']);

      var footer = app.page('test/fixtures/assignedmenus/c_footer.hbs');

      menus = getAssignedMenus(footer);
      expect(menus).to.eql(['footer']);
    });
  });


  describe('uses mutiple menus', function() {
    it('Files should have multiple menus if declared in frontmatter', function() {
      var multi = app.page('test/fixtures/assignedmenus/d_multi.hbs');

      var menus = getAssignedMenus(multi);
      expect(menus).to.eql(['main', 'footer']);

    });
  });
});