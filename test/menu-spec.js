'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
/*jshint multistr: true*/
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var Menu = require('../lib/menu.js');
var MenuItem = require('../lib/menuitem.js');
var assemble = require('assemble');
var app, menu;

describe('Menu', function () {
  it('should exist', function () {
    expect(Menu).to.be.an('function');
  });

  it('should return an object', function () {
    var menu = new Menu({});
    expect(menu).to.be.an('object');
  });

  describe('Menu instance', function () {
    var menu = new Menu({});

    it('should have an `items` array', function () {
      expect(menu.items).to.exist;
      expect(menu.items).to.be.an('array');
    });

  });

  describe('addItem method', function () {
    beforeEach(function () {
      // setup assemble
      app = assemble();
      if (!app.pages) {
        app.create('pages');
      }
      menu = new Menu({
        cwd: '/',
        base: '/'
      });
    });

    it('should accept a menuItem and add it to its own', function () {
      var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var mi = new MenuItem(page, 'main');
      expect(menu.items.length).to.equal(0); // contains 1 placeholder element
      menu.addItem(mi);
      expect(menu.items.length).to.equal(1); // placeholder overwriten by index
      //console.log('menu items', menu.items);
    });

    xit('should place index pages at front of array', function () {
      var aboutPage = app.page('about.hbs', {path: 'about.hbs', contents: new Buffer('a')});
      var aMi = new MenuItem(aboutPage, 'main');
      // console.log('about', aMi);
      var indexPage = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var iMi = new MenuItem(indexPage, 'main');
      // console.log('index', iMi);
      menu.addItem(aMi);
      menu.addItem(iMi);
      expect(menu.items[0].title).to.equal('index');
      expect(menu.items.length).to.equal(2);
    });

    it('should make index pages into directories', function () {
      var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var mi = new MenuItem(page, 'main');
      menu.addItem(mi);

      var productsPage = app.page('products/index.hbs', {path: 'products/index.hbs', contents: new Buffer('a')});
      var pMi = new MenuItem(productsPage, 'main');
      menu.addItem(pMi);

      var computersPage = app.page('products/computers.hbs', {path: 'products/computers.hbs', contents: new Buffer('a')});
      var cMi = new MenuItem(computersPage, 'main');
      menu.addItem(cMi);

      //console.log(menu.items);
      expect(menu.items[1].items[0].title).to.equal('computers');
    });

    it('should create a parent item when one does not exist', function () {
      // var productsPage = app.page('products/index.hbs', {path: 'products/index.hbs', contents: new Buffer('a')});
      // var pMi = new MenuItem(productsPage, 'main');
      //menu.addItem(pMi);
      var computersPage = app.page('products/computers.hbs', {cwd: '/', base: '/', path: 'products/computers.hbs', contents: new Buffer('a')});
      var cMi = new MenuItem(computersPage, 'main');
      menu.addItem(cMi);
      //console.log(JSON.stringify(menu.items[0], null, '\t'));
      expect(menu.items.length).to.equal(1);
    });

    it('should work with real files', function () {
      app.set('cwd', path.join(app.get('cwd'), 'test/mocks/src'));
      //console.log('cwd', app.get('cwd'));
      var page = app.page('media/news/releases/july-press-release.hbs');
      var mi = new MenuItem(page);
      menu.addItem(mi);
      //console.log(JSON.stringify(menu.items[0], null, '\t'));
      expect(menu.items[0].title).to.equal('media');
      expect(menu.items[0].items[0].title).to.equal('news');
      expect(menu.items[0].items[0].items[0].title).to.equal('releases');
      expect(menu.items[0].items[0].items[0].items[0].title).to.equal('july-press-release');
    });

    it('should use a custom menuPath when one is specified');

    it('should handle items that arrive out of order');

    it('should merge in details of menuItems with identical locations');

    it('should highlight path when menuItem.isActive is set to true');
  });

});
