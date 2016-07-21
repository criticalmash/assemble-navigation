'use strict';

/**
 * Assemble Navigation main function
 */
var Menu = require('./lib/menu');
var MenuItem = require('./lib/menuitem');
var _ = require('lodash');
var merge = require('mixin-deep');
var File = require('vinyl');

/**
 * create a Navigation instance
 * ```js
 * var navigation = new Navigation([config]);
 * ```
 * @param {object} config [optional config]
 */
function Navigation(config) {
  if (!(this instanceof Navigation)) {
    return new Navigation(config);
  }
  config = config || {};

  // create properties
  this.menus = {};

  // set properties
  this.setMenus(config.menus || ['main']);
  this.default = config.default || 'main';
}

/**
 * setMenus adds new menus to the menu list
 * @param {array} menus [menu names]
 */
Navigation.prototype.setMenus = function (menus) {
  for (var i = 0; i < menus.length; i++) {
    var menu = menus[i];
    var menuName = _.isString(menu) ? menu : menu.title;
    this.menus[menuName] = new Menu(menu);
  }
};

/**
 * defaultMenu() get's or sets the default menu for the navigation scheme
 * @param  {string} menu (optional) menu to set as default
 * @return {string}      name of default menu
 */
Navigation.prototype.defaultMenu = function (menu) {
  if (menu && this.menuExists(menu)) {
    this.default = menu;
  }
  return this.default;
};

/**
 * sees if a given menu name exists
 * @param  {string} menu [menu name]
 * @return {boolean}      [true if menu exists]
 */
Navigation.prototype.menuExists = function (menu) {
  return _.has(this.menus, menu);
};

/**
 * getAssignedMenus parses a view and returns any designated
 * menus for the file or the default menu.
 * Only returns existing menus
 * @param  {object} view [Assemble view]
 * @return {array}      [array of strings]
 */
Navigation.prototype.getAssignedMenus = function (view) {
  var pageData = view.data;
  var menus = _(pageData).has('menu') ? pageData.menu:this.default;
  // is menu a sting? then turn it into an array
  if (_.isString(menus)) {
    menus = [menus];
  }
  // filter out non-existing menus
  var self = this;
  menus = _.filter(menus, function (m) {
    return self.menuExists(m);
  });

  return menus;
};

Navigation.prototype.customMenuItem = function (config) {
  // if(!_.isObject(config)){
  //   throw 'customMenuItem needs config data';
  // }
  var stubView = new File({
    cwd: this.cwd,
    base: this.base,
    path: './'
  });
  stubView.data = {
    title: config.title || 'NO TITLE',
    menu: config.menu || this.default,
    linkId: config.linkId
  };
  stubView.data = merge({}, config.data, stubView.data);
  var menuItem = new MenuItem(stubView);
  menuItem.url = config.url || '/';
  menuItem.menuPath = config.menuPath ? config.menuPath.split('/') : ['.'];

  var menus = this.getAssignedMenus(stubView);
  var self = this;
  _(menus).forEach(function (name) {
    self.menus[name].addItem(menuItem);
  });

  return menuItem;
}

/**
 * examines an Assemble view object. THen creates
 * a menuItem object for each menu it belongs in
 * @param  {object} view [assemble view]
 */
Navigation.prototype.parseView = function (view) {
  var menus = this.getAssignedMenus(view);
  var self = this;
  _(menus).forEach(function (name) {
    var menuItem = new MenuItem(view);
    self.menus[name].addItem(menuItem);
  });
};

/**
 * adds a localized copy of the navigation object to view
 * @param  {object} view [assemble view]
 */
Navigation.prototype.inject = function (view) {
  var navLocal = _.cloneDeep(this.menus);

  // localize the menus
  // create menuItem based on view
  // set isCurrentPage to true
  // add revised menuItem to relevant menus in navLocal
  var menus = this.getAssignedMenus(view);
  var self = this;
  _(menus).forEach(function (name) {
    var menuItem = new MenuItem(view);
    menuItem.isCurrentPage = true
    navLocal[name].addItem(menuItem);
  });

  view.data = merge({}, {'navigation': navLocal, 'mainmenu': [1,2,3]}, view.data);
};

Navigation.prototype.getLocalMenu = function (view) {
  var navLocal = _.cloneDeep(this.menus);

  // localize the menus
  // create menuItem based on view
  // set isCurrentPage to true
  // add revised menuItem to relevant menus in navLocal
  var menus = this.getAssignedMenus(view);
  var self = this;
  _(menus).forEach(function (name) {
    var menuItem = new MenuItem(view);
    menuItem.isCurrentPage = true
    navLocal[name].addItem(menuItem);
  });

  return navLocal;
};

/**
 * Loops through each menu and delete's it items. This
 * prepares the menu for fresh data.
 * @return {[type]} [description]
 */
Navigation.prototype.clearMenus = function () {
  _.forEach(this.menus, function (menu) {
    menu.clearMenu();
  });
};

/**
 * Onload middleware for Assemble
 *
 * @return {function} [a middleware function]
 */
Navigation.prototype.onLoad = function () {
  var self = this;
  return function (view, next) {
    self.parseView(view);
    next();
  };
};


Navigation.prototype.preRender = function () {
  var self = this;
  return function (view, next) {
    if (typeof next !== 'function') {
      throw new TypeError('expected a callback function');
    }
    var navLocal = self.getLocalMenu(view);
    view.data = merge({}, {'navigation': navLocal}, view.data);
    //console.log('view.data', view.data);
    next(null, view);
  };
};



module.exports = Navigation;
