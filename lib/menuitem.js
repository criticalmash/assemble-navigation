'use strict';

/**
 * Assemble Navigation MenuItem function
 */

var path = require('path');
var rewrite = require('rewrite-ext');
var _ = require('lodash');
var _s = require('underscore.string');
var merge = require('mixin-deep');
var vinyl = require('vinyl');
var url = require('url');

var reRemoveFirstSlash = /^(\/)/;

/**
 * MenuItem Constructor
 * @param {Object} view [object hash or assemble/vinyl view]
 */
/**
 * MenuItem Constructor
 * @param {[type]} view    'object hash or assemble/vinyl view'
 * @param {[type]} options 'per menu overrides'
 */
function MenuItem(view, options) {
  if (!(this instanceof MenuItem)) {
    return new MenuItem(view);
  }

  // internal variables
  this._isVinyl = vinyl.isVinyl(view);
  this.basename = this.genStem(view);
  this.relative = this.relativePath(view);

  var data = {};
  options = options || {};
  merge(data, view.data, options);

  this.title = view.title || data['menu-title'] || data.title || view.stem || 'unknown';
  this.url = this.genUrl(view);
  this.linkId = data['linkId'] || this.generateLinkID(view);
  this.isCurrentPage = false;
  this.isActive = false;
  this.data = data;
  this.items = [];
  this.menuPath = data['menu-path'] ? MenuItem.genMenuPath(data['menu-path']):MenuItem.genMenuPath(this.relative, this.basename);
  this.menuIndex = -1;
  this.getView = function () {
    return view;
  }
}

/**
 * get name of file without file extension
 * @param  {Object} view 'view or hash Object'
 * @return {String}      'filename'
 */
MenuItem.prototype.genStem = function (view) {
  if (this._isVinyl) {
    return view.stem;
  };
  return path.basename(view.url, path.extname(view.url));
}

/**
 * get root relative URL for a menu item
 * or full URL for outside links
 * @param  {Object} view 'view or hash Object'
 * @return {String}      'url'
 */
MenuItem.prototype.genUrl = function (view) {
  if (this._isVinyl) {
    return view.path ? path.sep + rewrite(view.relative) : '#';
  };
  return view.url;
}

/**
 * root relative path for a menuItem
 * used to create urls and linkIds
 * @param  {Object} view 'view or hash Object'
 * @return {String}      'file path'
 */
MenuItem.prototype.relativePath = function (view) {
  if (vinyl.isVinyl(view)) {
    return view.relative;
  }
  var urlObj = url.parse(view.url);
  return urlObj.path.replace(reRemoveFirstSlash, '');
}

/**
 * generate a menuPath array
 * @param  {String} pathString 'path to file'
 * @param  {String} stem       'basename of file'
 * @return {Array}            'menuPath'
 */
MenuItem.genMenuPath = function (pathString, stem) {
  var menuPath;
  if(stem){
    menuPath = path.dirname(pathString).split(path.sep);
    if (stem !== 'index') {
      menuPath.push(stem);
    }
  }else{
    menuPath = pathString.split(path.sep);
  }
  
  return menuPath;
};

/**
 * Static function for generating linkIDs
 * @param  {Object} view [assemble/vinyl view]
 * @return {String}      [dom compatiable ID]
 */
MenuItem.prototype.generateLinkID = function (view) {
  return _s.slugify(path.dirname(this.relative) + ' ' + this.basename);
};

module.exports = MenuItem;
