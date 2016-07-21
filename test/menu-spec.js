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
      var mi = new MenuItem(page);
      expect(menu.items.length).to.equal(0); 
      menu.addItem(mi);
      expect(menu.items.length).to.equal(1); 
      //console.log('menu items', menu.items);
    });

    it('should place index pages at front of array', function () {
      /* create menu items */
      var aboutPage = app.page('about.hbs', {path: 'about.hbs', contents: new Buffer('a')});
      var aMi = new MenuItem(aboutPage);
      // console.log('about', aMi);
      var indexPage = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var iMi = new MenuItem(indexPage);
      // console.log('index', iMi);
      
      /* add them to menu */
      menu.addItem(aMi);
      // console.log('about page only', menu.items);
      menu.addItem(iMi);
      // console.log('index first?', menu.items);
      expect(menu.items[0].title).to.equal('index');
      expect(menu.items.length).to.equal(2);
    });

    it('should make index pages into directories', function () {
      var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var mi = new MenuItem(page);
      menu.addItem(mi);

      var productsPage = app.page('products/index.hbs', {path: 'products/index.hbs', contents: new Buffer('a')});
      var pMi = new MenuItem(productsPage);
      menu.addItem(pMi);

      var computersPage = app.page('products/computers.hbs', {path: 'products/computers.hbs', contents: new Buffer('a')});
      var cMi = new MenuItem(computersPage);
      menu.addItem(cMi);

      //console.log(menu.items);
      expect(menu.items[1].items[0].title).to.equal('computers');
    });

    it('should create a parent item when one does not exist', function () {
      // var productsPage = app.page('products/index.hbs', {path: 'products/index.hbs', contents: new Buffer('a')});
      // var pMi = new MenuItem(productsPage);
      //menu.addItem(pMi);
      var computersPage = app.page('products/computers.hbs', {cwd: '/', base: '/', path: 'products/computers.hbs', contents: new Buffer('a')});
      var cMi = new MenuItem(computersPage);
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
      var page2 = app.page('media/news/releases/june-press-release.hbs');
      var mi2 = new MenuItem(page2);
      menu.addItem(mi2);
      // console.log(JSON.stringify(menu.items[0], null, '\t'));
      expect(menu.items[0].title).to.equal('media');
      expect(menu.items[0].items[0].title).to.equal('news');
      expect(menu.items[0].items[0].items[0].title).to.equal('releases');
      expect(menu.items[0].items[0].items[0].items.length).to.equal(2);
      expect(menu.items[0].items[0].items[0].items[0].title).to.equal('july-press-release');
    });

    it('should use a custom menuPath when one is specified', function () {
      var homePage = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: default menu home\n--- a')
      });
      var hMi = new MenuItem(homePage);
      var mediaPage = app.page('index.hbs', {path: 'media/news/latest-news.hbs',
        contents: new Buffer('---\nmenu-path: news/latest \n---\na')
      });
      var mMi = new MenuItem(mediaPage);

      /* add items to menu */
      menu.addItem(hMi);
      menu.addItem(mMi);
      // console.log(JSON.stringify(menu.items, null, '\t'));

      /* test the menu */
      expect(menu.items[1].title).to.equal('news');
      expect(menu.items[1].items[0].title).to.equal('latest-news');
      expect(menu.items[1].items[0].url).to.equal('/media/news/latest-news.html');
    });

    it('should handle items that arrive out of order, and merge in stubs', function () {
      var homePage = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: default menu home\n--- a')
      });
      var hMi = new MenuItem(homePage);
      var newsPage = app.page('index.hbs', {path: 'media/news/latest-news.hbs',
        contents: new Buffer('---\nmenu-title: latest \n---\na')
      });
      var nMi = new MenuItem(newsPage);

      /* add items to menu */
      menu.addItem(hMi);
      menu.addItem(nMi);

      // console.log(JSON.stringify(menu.items, null, '\t'));
      expect(menu.items[1].title).to.equal('media');

      /* create media item and add to menu */
      var mediaPage = app.page('index.hbs', {path: 'media/index.hbs',
        contents: new Buffer('---\nmenu-title: Media Content \n---\na')
      });
      var mMi = new MenuItem(mediaPage);
      menu.addItem(mMi);

      /* test the menu */
      // console.log(JSON.stringify(menu.items, null, '\t'));
      expect(menu.items[1].title).to.equal('Media Content');
      expect(menu.items[1].items[0].title).to.equal('news');
      expect(menu.items[1].items[0].items[0].title).to.equal('latest');
    });

    it('should merge in details of menuItems with identical locations', function () {
      var homePage = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: first menu home\n--- a')
      });
      var hMi = new MenuItem(homePage);
      menu.addItem(hMi);

      expect(menu.items[0].title).to.equal('first menu home');

      var secondPage = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: second menu home\n--- a')
      });
      var sMi = new MenuItem(secondPage);
      menu.addItem(sMi);

      expect(menu.items[0].title).to.equal('second menu home');
    });

    it('should highlight path when menuItem.isCurrentPage is set to true', function () {
      /* setup initial menu */
      var newsPage = app.page('index.hbs', {path: 'media/news/latest-news.hbs',
        contents: new Buffer('---\nmenu-title: latest \n---\na')
      });
      var nMi = new MenuItem(newsPage);
      menu.addItem(nMi);

      /* page not in activePath */
      var aboutPage = app.page('about.hbs', {path: 'about.hbs',
        contents: new Buffer('---\nmenu-title: about \n---\na')
      });
      var aMi = new MenuItem(aboutPage);
      menu.addItem(aMi);

      expect(menu.items[0].items[0].items[0].isCurrentPage).to.be.false;

      /* now set isActive to highlight path */
      var newsView = app.page('index.hbs', {path: 'media/news/latest-news.hbs',
        contents: new Buffer('---\nmenu-title: latest \n---\na')
      });
      var miActive = new MenuItem(newsView);
      miActive.isCurrentPage = true;
      menu.addItem(miActive);

      // console.log(JSON.stringify(menu.items, null, '\t'));
      expect(menu.items[0].isActive, 'media.isActive').to.be.true;
      expect(menu.items[0].items[0].isActive, 'news.isActive').to.be.true;
      expect(menu.items[0].items[0].items[0].isActive, 'latest-news.isActive').to.be.false;
      expect(menu.items[0].items[0].items[0].isCurrentPage, 'latest-news.isCurrentPage').to.be.true;
      expect(menu.items[1].isActive, 'about.isActive').to.be.false;
    });

    it('should highlight and merge-in root elements too', function () {
      // setup nav
      var aboutPage = app.page('about.hbs', {path: 'about.hbs',
        contents: new Buffer('---\nmenu-title: about \n---\na')
      });
      var aMi = new MenuItem(aboutPage);
      menu.addItem(aMi);

      var homePage = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: first menu home\n--- a')
      });
      var hMi = new MenuItem(homePage);
      menu.addItem(hMi);

      // create highlighted home page
      var indexHomePage = app.page('index.hbs', {path: 'index.hbs',
        contents: new Buffer('---\ntitle: home\nmenu-title: first menu home\n--- a')
      });
      var iMi = new MenuItem(indexHomePage);
      iMi.isCurrentPage = true;
      menu.addItem(iMi);

      // examine menuItems
      //console.log(JSON.stringify(menu.items, null, '\t'));
      expect(menu.items[0].isCurrentPage, 'media.isCurrentPage').to.be.true;
    });

    it('should group siblings under same parent item', function () {
      
      var formerPage = app.page('artists/former.hbs', {path: 'artists/former.hbs',
        contents: new Buffer('---\nmenu-title: The Artist Formerly Known \n---\na')
      });
      var fMi = new MenuItem(formerPage);
      menu.addItem(fMi);

      var dodgerPage = app.page('artists/dodger.hbs', {path: 'artists/dodger.hbs',
        contents: new Buffer('---\nmenu-title: Artfull Dodger \n---\na')
      });
      var dMi = new MenuItem(dodgerPage);
      menu.addItem(dMi);

      var artistsPage = app.page('artists/index.hbs', {path: 'artists/index.hbs',
        contents: new Buffer('---\nmenu-title: Artists \n---\na')
      });
      var aMi = new MenuItem(artistsPage);
      menu.addItem(aMi);

      //console.log(JSON.stringify(menu.items, null, '\t'));
      expect(menu.items.length).to.equal(1);
      expect(menu.items[0].items.length).to.equal(2);

    });
  });

  describe('Clear Menu', function () {
    var menu = new Menu({});

    it('should exist', function () {
      expect(menu.clearMenu).to.be.a('function');
    });

    it('should delete all menuItems when called', function () {
      var page = app.page('index.hbs', {path: 'index.hbs', contents: new Buffer('a')});
      var mi = new MenuItem(page);
      menu.addItem(mi);
      expect(menu.items.length).to.equal(1);
      menu.clearMenu();
      expect(menu.items.length).to.equal(0); 
    });

  });


  // describe('Menu configuration', function () {
  //   beforeEach(function () {
  //     // setup assemble
  //     app = assemble();
  //     if (!app.pages) {
  //       app.create('pages');
  //     }
  //   });

  //   it('should have configurable link ordering', function () {
  //     // configure menu
  //     menu = new Menu({
  //       cwd: '/',
  //       base: '/',
  //       items: ['About Us', 'Products']
  //     });

  //     // insert menu items out of order
  //     var productsPage = app.page('products.hbs', {path: 'products.hbs',
  //       contents: new Buffer('')
  //     });
  //     var pMi = new MenuItem(productsPage);
  //     menu.addItem(pMi);

  //     var aboutPage = app.page('about.hbs', {path: 'about.hbs',
  //       contents: new Buffer('')
  //     });
  //     var aMi = new MenuItem(aboutPage);
  //     menu.addItem(aMi);

  //     // test order
  //     console.log(JSON.stringify(menu.items, null, '\t'));
  //     expect(menu.items[0].title).to.equal('about');
  //   });
  // });

});
