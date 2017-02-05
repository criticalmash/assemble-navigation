/**
 * Revised test suite for MenuItem
 */

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

  it('should create a new menuItem from a hash object', function () {
    var link = {
      title: 'title',
      url: 'mypage.html'
    };
    var mi = new MenuItem(link);

    expect(mi).to.be.an('object');
  });

  it('should properly set `basename` value from hash object', function () {
    var link = {
      title: 'Title',
      url: 'mypage.html'
    };
    var mi = new MenuItem(link);
    // console.log(link);
    expect(mi.basename).to.equal('mypage');
  });

  it('should properly set `basename` value from vinyl object', function () {
    var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
    var mi = new MenuItem(page);

    expect(mi.basename).to.equal('index');
  });

  it('should set `url` using vinyl path', function () {
    var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
    var item = new MenuItem(page);

    expect(item.url).to.eql('/index.html');
  });

  it('should properly set `url` value from hash object', function () {
    var link = {
      title: 'Title',
      url: 'mypage.html'
    };
    var mi = new MenuItem(link);

    expect(mi.url).to.equal('mypage.html');
  });

  it('should generate a `linkId` value from hash object', function () {
    var link = {
      title: 'News',
      url: 'media/news/latest-news.html'
    };
    var mi = new MenuItem(link);

    expect(mi.linkId).to.eql('media-news-latest-news');

    // outside link
    var outside = {
      title: 'News',
      url: 'http://sample.com/media/news/latest-news.html'
    };
    var out = new MenuItem(outside);

    expect(out.linkId).to.eql('media-news-latest-news');
  });

  it('should include deeplinks and GET requests in hash objects', function () {
    var link = {
      title: 'Title',
      url: 'http://example.com/mypage.html#deeplink'
    };
    var mi = new MenuItem(link);
    // console.log('deeplink', mi);
    expect(mi.url).to.equal('http://example.com/mypage.html#deeplink');

    var link = {
      title: 'Title',
      url: 'http://example.com/#deeplink/andDeeper'
    };
    var mi = new MenuItem(link);
    // console.log('deeplink', mi);
    expect(mi.url).to.equal('http://example.com/#deeplink/andDeeper');
  });

  describe('Relative path', function () {
    var menuItem;
    beforeEach(function () {
      menuItem = new MenuItem({title: 'News', url: 'latest-news.html'});
    });
    it('should work with vinyl view', function () {
      var page = app.page('media/news/latest-news.html', {path: 'media/news/latest-news.html', contents: new Buffer('a')});
      var item = new MenuItem(page);

      var relPath = item.relativePath(page);
      //console.log('rel path', relPath);
      expect(relPath).to.equal('media/news/latest-news.html');
    });

    it('should work with a hash object', function () {
      var relPath = menuItem.relativePath({title: 'News', url: '/media/news/latest-news.html'});
      expect(relPath).to.equal('media/news/latest-news.html');
    });

    it('should work with a hash object containing an outside link', function () {
      var relPath = menuItem.relativePath({title: 'News', url: 'http://sample.com/media/news/latest-news.html'});
      expect(relPath).to.equal('media/news/latest-news.html');
    });
  });

});