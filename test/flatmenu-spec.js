'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
/*jshint multistr: true*/

/**
 * Test the creation and use of flat menus
 */

var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var assemble = require('assemble');
var Navigation = require('../')
var Menu = require('../lib/menu.js');
var MenuItem = require('../lib/menuitem.js');

var app;


describe('Flat Menus', function (){

  beforeEach(function () {
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
  });

  it('should be created when passed type="flat"', function (){
    var menu = new Menu({'menu-name': 'footer', 'type': 'flat'});
    expect(menu.getType()).to.equal('flat');
  });

  it('should use hierarchal menus by default', function (){
    var menu = new Menu('amenu');
    expect(menu.getType()).to.equal('hierarchal');
  });

  it('should store all menu items under the root items array', function () {
    var menu = new Menu({'menu-name': 'footer', 'type': 'flat'});
    var homePage = app.page('index.hbs', {path: 'index.hbs',contents: new Buffer('a')});
    var subPage = app.page('a/index.hbs', {path: 'a/index.hbs',contents: new Buffer('a')});
    var deepPage = app.page('a/b/deep.hbs', {path: 'a/b/deep.hbs',contents: new Buffer('a')});
    var deeperPage = app.page('a/b/c/deeper.hbs', {path: 'a/b/c/deeper.hbs',contents: new Buffer('a')});

    menu.addItem(new MenuItem(homePage));
    menu.addItem(new MenuItem(subPage));
    menu.addItem(new MenuItem(deepPage));
    menu.addItem(new MenuItem(deeperPage));

    // console.log('flat menu', menu.items);
    expect(menu.items.length).to.equal(4);

  });

});