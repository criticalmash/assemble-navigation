'use strict';

/**
 * Assemble Navigation MenuItem function
 */

var path = require('path');
var rewrite = require('rewrite-ext');
var _ = require('lodash');
var _s = require('underscore.string');

/**
 * MenuItem Constructor
 * @param {Object} view [assemble/vinyl view]
 */
function MenuItem(view) {
  if (!(this instanceof MenuItem)) {
    return new MenuItem(view);
  }
  var data = view.data || {};

  this.title = data['menu-title'] || data.title || view.stem || 'unknown';
  this.url = view.path ? path.sep + rewrite(view.relative) : '#';
  this.linkId = data['linkId'] || MenuItem.generateLinkID(view);
  this.isCurrentPage = false;
  this.isActive = false;
  this.data = data;
  this.items = [];
  this.menuPath = data['menu-path'] ? MenuItem.menuPath(data['menu-path'], view.stem):MenuItem.menuPath(view.relative, view.stem);
  this.basename = view.stem;
}

MenuItem.menuPath = function (pathString, stem) {
  // console.log('menuPath', pathString, path.dirname(pathString));
  var menuPath = path.dirname(pathString).split(path.sep);
  if (stem !== 'index') {
    menuPath.push(stem);
  }
  return menuPath;
};

/**
 * Static function for generating linkIDs
 * @param  {object} view [assemble/vinyl view]
 * @return {string}      [dom compatiable ID]
 */
MenuItem.generateLinkID = function (view) {
  var directory = path.dirname(view.relative);
  var linkId;
  linkId = _s.slugify(directory + ' ' + view.stem);
  return linkId;
};

module.exports = MenuItem;
