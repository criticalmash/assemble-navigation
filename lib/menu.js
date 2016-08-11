'use strict';

var path = require('path');
var _ = require('lodash');
var _s = require('underscore.string');
var File = require('vinyl');
var merge = require('mixin-deep');

var MenuItem = require('./menuitem.js');

/**
 * Create a menu object to be added to Navigation
 * @param {[type]} config 'Optional config information'
 */
function Menu(config) {
  if (!(this instanceof Menu)) {
    return new Menu(config);
  }
  config = config || {};
  this.items = [];
  this.cwd = config.cwd || process.cwd();
  this.base = config.base || process.cwd();
  this.title = _.isString(config) ? config : config['menu-name'];
  this.linkId = _s.slugify(this.title);
  this._type = config.type==='flat' ? 'flat' : 'hierarchal';
}

Menu.prototype.getType = function() {
  return this._type;
};

/**
 * add a menu item to the menu tree
 * if an item's branch dones't exist create it using stub menuItems
 * @param {Object} menuItem 'a menuItem object'
 */
Menu.prototype.addItem = function (menuItem) {
  var menuPath = _.cloneDeep(menuItem.menuPath);
  if (this._type==='flat' || menuPath[0] === '.'){
    /* root items */
    if (menuItem.basename==='index') {
      this.insertItem(this.items, menuItem, true);
    }else{
      this.insertItem(this.items, menuItem);
    }
  }else{
    /* sub-menus */
    this.placeItem(this.items, menuPath, '/', menuItem);
  }
};

/**
 * Recursively search a menu branch to find the proper location
 * to place a menu item
 * @param  {Array} branch     'the items array to search'
 * @param  {String} menuPath   'the filepath of the menuItem relative to the branch'
 * @param  {String} parentPath 'the root relative filepath of the current branch'
 * @param  {[type]} menuItem   'the menu item to place'
 * @return {[type]}            [description]
 */
Menu.prototype.placeItem = function (branch, menuPath, parentPath, menuItem) {
  var parentName = menuPath.shift();
  if (menuPath.length) {
    // go down a directory
    var itemPath = path.join(parentPath, parentName);
    var subBranch = _(branch).find(function (o) {
      var testpath = path.join('/', o.menuPath.join('/'));
      return testpath === itemPath;
    });
    var nextPath = path.join(parentPath, parentName);
    if (!subBranch) {
      // create stub item
      subBranch = this.stubMenuItem(branch, nextPath, parentName);
    }
    subBranch.isActive = menuItem.isCurrentPage;
    this.placeItem(subBranch.items, menuPath, nextPath, menuItem);

  } else {
    this.insertItem(branch, menuItem);
  }
};

/**
 * attaches menuitem to branch.
 * If menuitem is an index page, it will be added to the begining
 * of the array. Otherwise added to the end.
 * @param  {array} branch   [a menu branch]
 * @param  {[type]} menuItem [item to add]
 */
Menu.prototype.insertItem = function (branch, menuItem, unshift){
  var overWrite = _.findIndex(branch, function(item){
    return item.menuPath.join() === menuItem.menuPath.join();
  });
  if(overWrite >= 0){
    branch[overWrite] = _.merge(branch[overWrite], menuItem);
  }else{
    if(unshift){
      this.items.unshift(menuItem);
    }else{
      branch.push(menuItem);
    }
  }
};

/**
 * Creates a stub menuItem to hold a child menu item when
 * views are loaded out of order.
 * Stub menuItems will be overwriten when the parent item is loaded
 * @param  {array} branch     'the stubs parent's items array'
 * @param  {String} nextPath   'filepath for the stubs direcotry'
 * @param  {String} parentName 'stubs Title'
 * @return {Object}            'the Stub menuItem'
 */
Menu.prototype.stubMenuItem = function (branch, nextPath, parentName) {
  var stubView = {
    title: parentName,
    url: path.join(nextPath, 'index.html')
  };
  //console.log('stubView', stubView.path);
  var menuItem = new MenuItem(stubView);
  branch.push(menuItem);
  return menuItem; // newBranch object
};

Menu.prototype.clearMenu = function() {
  this.items = [];
};


Menu.prototype.sort = function(fn) {
  Menu.sortRecurse(this, fn);
  return true;
};

Menu.sortRecurse = function(parent, fn) {
  var sorter = Menu.customSort(parent, fn);
  parent.items.sort(sorter);
  parent.items.forEach(function (item){
    Menu.sortRecurse(item, fn);
  });
};

Menu.customSort = function(parent, fn) {
  // console.log('create sorter for', parent.title);
  return function (a, b) {
    return fn(a, b, parent);
  }
};


module.exports = Menu;
