'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
/*jshint multistr: true*/
var chai = require('chai');
var expect = chai.expect;
var assemble = require('assemble');
var app;

var Navigation = require('../');

describe('Navigation', function () {
  it('should exist', function () {
    expect(Navigation).to.be.an('function');
  });

  it('should return an object', function () {
    var navi = new Navigation();
    expect(navi).to.be.an('object');
  });

  describe('navigation instance', function () {
    it('should have middleware functions', function () {
      var navi = new Navigation();
      var onLoad = navi.onLoad();
      expect(onLoad).to.be.a('function');

      var preRender = navi.preRender();
      expect(preRender).to.be.a('function');
    });
  });

  describe('menu list', function () {
    var navi;

    it('should have a default `main` menu', function () {
      navi = new Navigation();
      expect(navi.menus).to.be.an('object', 'menus list missing');
      expect(navi.menus.main).to.exist;
      expect(navi.defaultMenu()).to.equal('main', 'default menu main not set');
    });

    it('should use custom menu`s when specified', function () {
      navi = new Navigation({'menus': ['header', 'footer']});
      expect(navi.menus.header).to.exist;
      expect(navi.menus.footer).to.exist;
    });

    it('should set default menu when specified', function () {
      navi = new Navigation({'menus': ['header', 'footer'], 'default': 'header'});
      expect(navi.defaultMenu).to.be.a('function');
      expect(navi.defaultMenu()).to.equal('header');
    });

    it('should set default menu with defaultMenu()', function () {
      navi = new Navigation({'menus': ['main', 'footer']});
      expect(navi.defaultMenu('footer')).to.equal('footer');
      expect(navi.defaultMenu()).to.equal('footer');
    });

    it('should not set default when menu does not exist', function () {
      navi = new Navigation({'menus': ['main', 'footer']});
      expect(navi.defaultMenu('top')).to.equal('main');
      expect(navi.defaultMenu()).to.equal('main');
    });

    xit('should accept custom menu ordering', function () {
      navi = new Navigation({'menus': [{
        title: 'main', 
        items: ['about', 'products']
      }]});

      console.log(JSON.stringify(navi.menus.main.items, null, '\t'));
      expect(navi.menus.main).to.be.an('object');
      expect(navi.menus.main.items.length).to.equal(2);
      expect(navi.menus.main.items[0].title).to.equal('About Us');
    });
  });

  describe('menu exists', function () {
    var navi;

    it('should know when a menu does not exist', function () {
      navi = new Navigation({'menus': ['main', 'footer']});
      expect(navi.menuExists('top')).to.be.false;
      expect(navi.menuExists('footer')).to.be.true;
    });
  });

  describe('getAssignedMenus', function () {
    var navi = new Navigation({'menus': ['main', 'footer']});
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }

    it('should return main when no menu`s are set in frontmatter', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: mytitle\nmenu-title: menutitle\n--- a')
      });
      var menus = navi.getAssignedMenus(page);
      expect(menus).to.be.an('array');
      expect(menus.length).to.equal(1);
      expect(menus[0]).to.equal('main');
    });

    it('should return custom menu when set in frontmatter', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: mytitle\nmenu: footer\n--- a')
      });
      var menus = navi.getAssignedMenus(page);
      expect(menus.length).to.equal(1);
      expect(menus[0]).to.equal('footer');
    });

    it('should return multiple menus when set in frontmatter', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: mytitle\nmenu:\n  - main\n  - footer \n--- a')
      });
      var menus = navi.getAssignedMenus(page);
      expect(menus.length).to.equal(2);
      expect(menus[0]).to.equal('main');
      expect(menus[1]).to.equal('footer');
    });

    it('should only return menus that exist in menu list', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: mytitle\nmenu:\n  - main\n  - topbar \n--- a')
      });
      var menus = navi.getAssignedMenus(page);
      expect(menus.length).to.equal(1);
      expect(menus[0]).to.equal('main');
    });
  });

  describe('parseView', function () {
    var navi;
    beforeEach(function () {
      navi = new Navigation({'menus': ['main', 'footer']});
      app = assemble();
      if (!app.pages) {
        app.create('pages');
      }
    });

    it('should add page to default menu', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: default menu home\n--- a')
      });
      navi.parseView(page);
      expect(navi.menus.main.items[0].title).to.equal('default menu home');
    });

    it('should add page to designated menu', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: legal\nmenu: footer\n--- a')
      });
      navi.parseView(page);
      expect(navi.menus.footer.items[0].title).to.equal('legal');
    });

    it('should not add page to non-existant menu', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: legal\nmenu: foobar\n--- a')
      });
      navi.parseView(page);
      expect(navi.menus.main.items.length).to.equal(0);
      expect(navi.menus.footer.items.length).to.equal(0);
    });

    it('should add page to multiple menus', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: multiple\nmenu: \n  - main\n  - footer\n--- a')
      });
      navi.parseView(page);
      expect(navi.menus.main.items[0].title).to.equal('multiple');
      expect(navi.menus.footer.items[0].title).to.equal('multiple');
    });
  });

  describe('inject', function () {
    var navi;
    beforeEach(function () {
      navi = new Navigation({'menus': ['main', 'footer']});
      app = assemble();
      if (!app.pages) {
        app.create('pages');
      }
    });

    it('should add navigation data to the view', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: default menu home\n--- a')
      });
      navi.parseView(page);
      navi.inject(page);
      //console.log('navigation', page.data.navigation.main.items[0]);
      expect(page.data.navigation).to.be.an('object');
      expect(page.data.navigation.main.items[0].title).to.equal('default menu home');
    });

    it('should localize navigation data', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: default menu home\n--- a')
      });
      navi.parseView(page);
      navi.inject(page);
      // console.log('navigation', page.data.navigation.main.items[0]);
      //console.log(JSON.stringify(page.data.navigation, null, '\t'));
      expect(page.data.navigation.main.items[0].isCurrentPage).to.be.true;
    });

    it('should localize navigation data for complex structures');

    it('should only localize copies of the original menus', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: default menu home\n--- a')
      });
      navi.parseView(page);
      navi.inject(page);
      // console.log('navigation', page.data.navigation.main.items[0]);
      //console.log(JSON.stringify(page.data.navigation, null, '\t'));
      expect(navi.menus.main.items[0].isCurrentPage).to.be.false;
    });

  });

  describe('custom links', function () {
    var navi;
    beforeEach(function () {
      navi = new Navigation({'menus': ['main', 'footer']});
      app = assemble();
      if (!app.pages) {
        app.create('pages');
      }
    });

    it('should accept custom links', function () {
      var cmi = navi.customMenuItem({
        title: 'Link to PDF',
        url: '/downloads/pdf/salesbrochure.pdf',
        menuPath: 'info/downloads/salesbrochure',
        linkId: 'sales-brochure-link'
      });
      // console.log('customMenuItem', cmi);
      //console.log(JSON.stringify(navi.menus.main.items, null, '\t'));
      expect(navi.menus.main.items[0].title).to.equal('info');
      expect(navi.menus.main.items[0].items[0].title).to.equal('downloads');
      expect(navi.menus.main.items[0].items[0].items[0].title).to.equal('Link to PDF');
      expect(navi.menus.main.items[0].items[0].items[0].url).to.equal('/downloads/pdf/salesbrochure.pdf');
    });

    it('should accept a custom link to another domain', function () {
      var cmi = navi.customMenuItem({
        title: 'Link Title',
        url: 'http://google.com'
      });
     // console.log('customMenuItem', cmi);
      expect(navi.menus.main.items[0].url).to.equal('http://google.com');
    });
  });

});
