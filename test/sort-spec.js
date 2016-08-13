'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
/*jshint multistr: true*/

/**
 * sort-spec.js
 * Tests for menu sorting functionality
 */
var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var assemble = require('assemble');
var Navigation = require('../')
var app, menu;

/**
 * Sorting functions
 */

/**
 * Sorts menu items by title
 * @param  {[type]} menuItem_a [description]
 * @param  {[type]} menuItem_b [description]
 * @return {[type]}            [description]
 */
function sortByTitle (menuItem_a, menuItem_b) {
  if(menuItem_a.title > menuItem_b.title){
    return 1;
  }
  if(menuItem_a.title < menuItem_b.title){
    return -1;
  }
  return 0;
}

/**
 * A custom sort that sortsByTitle by default and uses the
 * custom attribute `data.special` for items under the product
 * menu.
 * @param  {[type]} menuItem_a [description]
 * @param  {[type]} menuItem_b [description]
 * @param  {[type]} parent     [description]
 * @return {[type]}            [description]
 */
function sortByTitleOrSpecial (menuItem_a, menuItem_b, parent) {
  // console.log('Parent', parent.linkId);
  if (parent.linkId==='products-index') {
    return menuItem_a.data.special - menuItem_b.data.special;
  }else{
    return sortByTitle(menuItem_a, menuItem_b);
  }
}

/**
 * Items in the main menu are sorted as they are in the array.
 * The rest aer sorted by title.
 * @param  {[type]} a      [description]
 * @param  {[type]} b      [description]
 * @param  {[type]} parent [description]
 * @return {[type]}        [description]
 */
function sortByLinkId (a, b, parent) {
  var ids = ['index', 'products-index', 'media-index', 'about'];
  if (parent.linkId==='main') {
    var a_index = _.indexOf(ids, a.linkId);
    var b_index = _.indexOf(ids, b.linkId);
    return a_index - b_index;
  }else{
    return sortByTitle(a, b);
  }
}

/**
 * Tests
 */
describe('menu sorting', function (){
  var navi;
  beforeEach(function () {
    navi = new Navigation({'menus': ['main', 'footer']});
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
    app.pages.onLoad(/\.hbs$|\.md$/, navi.onLoad());
    app.pages('test/mocks/sort/**/*.{md,hbs}');
  });

  it('should apply sort function to root items', function () {
    navi.menus.footer.sort(sortByTitle);
    // console.log('footer items', navi.menus.footer.items);
    expect(navi.menus.footer.items[0].title).to.equal('About');
  });

  it('should sort items recursively', function () {
    navi.menus.main.sort(sortByTitle);
    // console.log('main items', navi.menus.main.items);
    expect(navi.menus.main.items[0].title).to.equal('About');

    // console.log('product items', navi.menus.main.items[2]);
    expect(navi.menus.main.items[2].items[0].title).to.equal('Apples');

    // console.log('product items', navi.menus.main.items[3].items[0].items[0]);
    expect(navi.menus.main.items[3].items[0].items[0].items[0].title).to.equal('April Post');
    expect(navi.menus.main.items[3].items[0].items[0].items[3].title).to.equal('Second Post');
  });

  it('should access parent item of items being sorted', function () {
    navi.menus.main.sort(sortByTitleOrSpecial);
    // console.log('footer items', navi.menus.main.items);
    expect(navi.menus.main.items[0].title).to.equal('About');
    expect(navi.menus.main.items[2].items[0].title).to.equal('Candy');
  });

  it('should use an arbitary order using linkId', function () {
    navi.menus.main.sort(sortByLinkId);
    // console.log('main items', navi.menus.main.items);
    // sorted by linkId
    expect(navi.menus.main.items[0].title).to.equal('Home');
    expect(navi.menus.main.items[1].title).to.equal('Products');
    expect(navi.menus.main.items[2].title).to.equal('media');
    expect(navi.menus.main.items[3].title).to.equal('About');
    // sorted by title
    expect(navi.menus.main.items[2].items[0].items[0].items[0].title).to.equal('April Post');
  });
});