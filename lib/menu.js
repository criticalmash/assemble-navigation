'use strict';

var path = require('path');
var _ = require('lodash');
var File = require('vinyl');
var merge = require('mixin-deep');

var MenuItem = require('./menuitem.js');

/**
 * Assemble Navigation Menu object
 */

function Menu(config) {
  if (!(this instanceof Menu)) {
    return new Menu(config);
  }
  config = config || {};
  this.items = [];
  this.cwd = config.cwd || process.cwd();
  this.base = config.base || process.cwd();
}

Menu.prototype.addItem = function (menuItem) {
  var menuPath = _.cloneDeep(menuItem.menuPath);
  if (menuPath[0] === '.'){
    /* root items */
    if (menuItem.basename==='index') {

      //this.items.unshift(menuItem);
      this.insertItem(this.items, menuItem, true);
    }else{
      this.insertItem(this.items, menuItem);
    }
  }else{
    /* sub-menus */
    this.placeItem(this.items, menuPath, this.base, menuItem);
  }
};

Menu.prototype.placeItem = function (branch, menuPath, parentPath, menuItem) {
  var parentName = menuPath.shift();
  if (menuPath.length) {
    // go down a directory
    var subBranch = _(branch).find(function (o) {
      return path.join('/', o.menuPath.join('/')) === path.join(parentPath, parentName);
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

Menu.prototype.stubMenuItem = function (branch, nextPath, parentName) {
  var stubView = new File({
    cwd: this.cwd,
    base: this.base,
    path: path.join(nextPath, 'index.html')
  });
  stubView.data = {title: parentName};
  var menuItem = new MenuItem(stubView);
  branch.push(menuItem);
  return menuItem; // newBranch object
};


module.exports = Menu;
