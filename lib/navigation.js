/*
 * Assemble Plugin: assemble-navigation
 * https://github.com/criticalmash/assemble-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 * This plugin provides context data to build a heirarchal navigation for an Assemble site
 *
 * Provides main logic for building navigation objects and inserting them into a
 * page's context
 *
 * Copyright (c) 2014 criticalmash
 * Licensed under the MIT license.
 */

// node builtins
var path = require('path');

// node_modules
var grunt = require('grunt');
//var yfm = require('assemble-yaml');
var _   = require('lodash');
var _s = require('underscore.string');



var navMethods = function(){
  var self = this;
  // navigation and options data
  this.navigation = {};
  this.options = {};
  this.defaultMenu = ['main'];

  // default navigation config
  this.template = {
    items: []
  };

  function parseOptions(optionsIn){
    var optionsOut = {};

    _.forOwn(optionsIn, function(prop, key){
      var template = _.cloneDeep(self.template);
      optionsOut[key] = _.defaults(prop, template);
    });

    // decide on the default menu
    self.defaultMenu = _(optionsOut).findKey({default:true}) || 'main';

    return optionsOut;
  }

  function startNav(){
    // for now, the nav is just a deep copy of the config
    var navi = _.cloneDeep(self.options);
    return navi;
  }

  /**
   * Find site root relative path to this page
   * @param  {[type]} pageObj [description]
   * @return {[type]}         [description]
   */
  function findPath(pageObj){
    var filePath = pageObj.dest;
    var siteRoot = pageObj.filePair.orig.dest;
    var sitePath = path.relative(siteRoot, filePath);
    return path.sep + sitePath;
  }

  /**
   * Find out which menus this page attaches to
   * @param  {[type]} pageObj [description]
   * @return {[type]}         [description]
   */
  function getAssignedMenus(pageObj){
    var pageData = pageObj.data;
    var menus = _(pageData).has('menu')?pageData['menu']:self.defaultMenu;
    // is menu a sting? then turn it into an array
    if(_.isString(menus)){
      menus = [menus];
    }

    return menus;
  }

  function createMenuItem(menu, pageObj){
    var pageData = pageObj.data;
    var url = findPath(pageObj);
    var menuItem = {
      title: pageData['menu-title'] || pageData.title || pageObj.basename,
      url: url,
      isCurrentPage: false,
      isActive: false,
      linkId: _s.slugify(menu+' '+path.dirname(url)+' '+pageObj.basename)
    };
    return menuItem;
  }

  /**
   * Hook for assemble:post:pages that scans the pages
   * data to build a navigation data object
   *
   * @param  {object} params - Assemble params
   * @return {Object} navigation object -used for testing
   */
  this.build = function build(params){
    //grunt.log.write(JSON.stringify(params, null, '\t')+'\n\n');

    // grab params proerties we want
    var pages     = params.assemble.options.pages;
    self.options   = params.assemble.options.navigation || {main:{}};

    // set config options, using defaults
    self.options = parseOptions(self.options);
    grunt.verbose.write('\n parsed options: ' + JSON.stringify(self.options, null, '\t')+'\n\n');

    // start the nav object based on the given config
    self.navigation = startNav();

    // parse the pages array and use it to build navigation
    _(pages).forEach(function(pageObj){
      var pageData = pageObj.data;
      var menus =  getAssignedMenus(pageObj); // finds the menus this page is assigned to
      grunt.verbose.write('\n\n menu for page: ' + pageObj.basename + ' is '+ JSON.stringify(menus) +'\n');

      _(menus).forEach(function(menu){
        grunt.verbose.write('add '+ pageData.title + ' to '+ menu + '\n');
        self.navigation[menu].items.push(createMenuItem(menu, pageObj));
      });

    });
    grunt.log.write('\n Navigation: ' + JSON.stringify(self.navigation, null, '\t')+'\n\n');

    // for testing purposes, we'll return the initialized navigation object
    return self.navigation;
  };

  this.inject = function inject(params){
    // get information on the current page
    var options    = params.context;
    var page       = options.page;

    // make a copy of the navigation object
    var navLocal = _.cloneDeep(self.navigation);

    // alter our copy to indicate current page and it's parents

    // attach revised nav to our page's context
    params.context.navigation = navLocal;
  };
};

module.exports = new navMethods();
