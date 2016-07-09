'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
/*jshint multistr: true*/
var chai = require('chai');
var expect = chai.expect;

var assemble = require('assemble');
var app;

var MenuItem = require('../lib/menuitem.js');

describe('MenuItem', function () {
  beforeEach(function () {
    // setup assemble
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
  });

  it('should create a new menuItem from a view', function () {
    var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
    var mi = new MenuItem(page);

    expect(mi).to.be.an('object');
  });

  describe('test defaults', function () {
    it('should have minimum default values', function () {
      var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var item = new MenuItem(page);

      //console.log('menuItem', item);

      expect(item.title).to.eql('index');
      expect(item.url).to.eql('/index.html');
      expect(item.linkId).to.eql('index');
      expect(item.isCurrentPage).to.be.false;
      expect(item.isActive).to.be.false;
      expect(item.data).to.exist;
      expect(item.basename).to.eql('index', 'basename undefined');
    });

    xit('should create a valid menuItem with just a linkId', function () {
      var item = new MenuItem({linkId: 'about'});

      console.log('menuItem from linkId', item);
      expect(item.linkId).to.equal('about');
      expect(item.title).to.eql('about');
      expect(item.url).to.eql('#');
      expect(item.isCurrentPage).to.be.false;
      expect(item.isActive).to.be.false;
      expect(item.data).to.exist;
      expect(item.basename).to.eql('about', 'basename undefined');
    });
  });

  describe('link titles', function () {
    it('should use title frontmatter when available', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: mytitle\n--- a')
      });
      var item = new MenuItem(page);
      expect(item.title).to.eql('mytitle');
    });

    it('should use menu-title frontmatter when available', function () {
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: mytitle\nmenu-title: menutitle\n--- a')
      });
      var item = new MenuItem(page);
      expect(item.title).to.eql('menutitle');
    });

  });

  describe('generateLinkID', function () {
    it('should always start with the menu id', function () {
      var page = app.page('index.hbs', {path: 'media/news/latest-news.hbs', contents: new Buffer('a')});
      var item = new MenuItem(page);
      expect(item.linkId).to.eql('media-news-latest-news');
    });

    it('should accept a custom linkID in data attribute', function (){
      var page = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\nlinkId: my-custom-link-id\n--- a')
      });
      var item = new MenuItem(page);
      expect(item.linkId).to.eql('my-custom-link-id');
    });

    xit('should account for CWD', function () {
      var page = app.page('media/news/latest-news.hbs', {cwd: '/media', path: 'media/news/latest-news.hbs', contents: new Buffer('a')});
      var item = new MenuItem(page);
      expect(item.linkId).to.eql('media-news-latest-news');
    });
  });

  describe('menu path array', function () {
    it('should generate a default menupath value from filepath', function () {
      var page = app.page('media/news/latest-news.hbs', {path: 'media/news/latest-news.hbs', contents: new Buffer('a')});
      var item = new MenuItem(page);
      expect(item.menuPath).to.eql(['media', 'news', 'latest-news']);
    });

    it('should use a custom menupath value when set in frontmatter', function () {
      var page = app.page('index.hbs', {path: 'media/news/latest-news.hbs',
        contents: new Buffer('---\nmenu-path: news/latest \n---\na')
      });
      var item = new MenuItem(page);
      //console.log('item.data', item.data);
      expect(item.menuPath).to.eql(['news', 'latest-news']);
    });
  });

});
