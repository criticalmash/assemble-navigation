'use strict';

var path = require('path');
var _ = require('lodash');
var File = require('vinyl');

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
  this.placeItem(this.items, menuPath, this.base, menuItem);
};

Menu.prototype.placeItem = function (branch, menuPath, parentPath, menuItem) {
  var parentName = menuPath.shift();
  if (menuPath.length) {
    // go down a directory
    var subBranch = _(branch).find(function (o) {
      return o.menuPath[0] === parentName;
    });
    var nextPath = path.join(parentPath, parentName);
    if (!subBranch) {
      // create stub item
      subBranch = this.stubMenuItem(branch, nextPath);
    }
    this.placeItem(subBranch.items, menuPath, nextPath, menuItem);

  } else {
    branch.push(menuItem);
  }
};

Menu.prototype.stubMenuItem = function (branch, path) {
  //console.log('stub path', path);
  var stubView = new File({
    cwd: this.cwd,
    base: this.base,
    path: path
  });
  //console.log('stubView', stubView);
  var menuItem = new MenuItem(stubView);
  branch.push(menuItem);
  return menuItem; // newBranch object
};


module.exports = Menu;
