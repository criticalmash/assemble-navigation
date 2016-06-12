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
var _   = require('lodash');
var _s = require('underscore.string');
var merge = require('mixin-deep');
var File = require('vinyl');
var rewrite = require('rewrite-ext');



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
      var items = [];
      // see if menu has any default items
      if(_(prop).has('items')){
        _(prop.items).forEach(function(item){
          if(_.isString(item)){
            var menuItem = {
              linkId: item,
              menu_index : item.menu_index || items.length
            };
            items.push(menuItem);
          }else{
            if(!_(item).has('menu_index')){
              item.menu_index = items.length;
            }
            items.push(item);
          }
        });
        prop.items = items;
      }

      // build our menu
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

  /**
   * Returns an array describing the page's path in the heirarchy
   * Used by addToTree to place the a menu item onto it's heirarchy
   * @param  {object} pageObj [Assemble page view]
   * @return {array}         [filepath]
   */
  function findMenuPath(pageObj){
    var dir = path.dirname(pageObj.relative).split(path.sep);
    return dir;
  }

  /**
   * Create a menu item that will be added to a menu.
   * @param  {object} view an Assemble page view
   * @param  {string} menu the menu's name
   * @return {object}      the menu item
   */
  function createMenuItem(view, menu){
    var pageData = view.data;
    var url = view.relative;
    var menuItem = {
      // find the best name for a title
      title: pageData['menu-title'] || pageData.title || view.stem,
      url: path.sep + rewrite(url),
      // currentpage/active is used to flag the current page in the navigation
      isCurrentPage: false,
      isActive: false,
      // create a unique slug for use in an id attribute
      linkId: generateLinkId(view, menu),
      basename: view.stem,
      // if you want to pass extra info to a nav item, add it to the front-matter
      data: pageData
    };
    return menuItem;
  }

  function generateLinkId(view, menu){
    var directory = path.dirname(view.relative);
    var linkId;
    linkId = _s.slugify(menu+' '+directory+' '+view.stem);
    return linkId;
  }


  function OLDaddToTree(menuRoot, pathArr, menuItem){
    // if path array is '.' then just add menu item to root
    if(pathArr[0]==='.'){
      if(_(menuRoot.items).find({linkId: menuItem.linkId})){
        //grunt.verbose.write('\n Found match for: ' + menuItem.linkId + '\n');
        var defaultItem = _(menuRoot.items).find({linkId: menuItem.linkId});
        defaultItem = _.defaults(defaultItem, menuItem);
      }else{
        menuItem.menu_index = menuRoot.items.length;
        menuRoot.items.push(menuItem);
      }
    }else{
      // build a branch for our new item, then merge into existing tree
      growBranch(menuRoot.items, pathArr, menuItem, 'main');
    }
  }

  function addToTree(menuRoot, pathArr, menuItem){
    //console.log('addToTree', pathArr, menuItem.linkId);
    // if path array is '.' then just add menu item to root
    if(pathArr[0]==='.'){
      //console.log('looking for: ' + menuItem.linkId);
      if(_(menuRoot.items).find({linkId: menuItem.linkId})){
        //console.log('Found match for: ' + menuItem.linkId);
        var defaultItem = _(menuRoot.items).find({linkId: menuItem.linkId});
        defaultItem = _.defaults(defaultItem, menuItem);
      }else{
        menuItem.menu_index = menuRoot.items.length;
        menuRoot.items.push(menuItem);
      }
    }else{
      // build a branch for our new item, then merge into existing tree
      growBranch(menuRoot.items, pathArr, menuItem, 'main');
    }
    //console.log('revised menu', menuRoot);
  }

  function growBranch(menu, pathArr, menuItem, linkId){
    //console.log('pathArr ',pathArr);
    //console.log('   menu ',menu);
    var dirname = pathArr.shift();
    var dirRef;

    linkId = _s.slugify(linkId+" "+dirname);

    // if dir desn't exist, create it
    if(!_(menu).find({linkId: linkId})){
      //console.log(' Creating dir');
      //console.log('   Creating dir '+linkId);
      //console.log('   length of menu: '+menu.length);
      dirRef = {
        title: dirname,
        items: [],
        linkId: linkId,
        url: '#',
        menu_index: menu.length || 171
      };
      menu.push(dirRef);
    }else{
      //console.log('\n Using existing dir\n');
      dirRef = _(menu).find({linkId: linkId});
    }

    if(pathArr.length===0){
      // is page an index?
      if(menuItem.basename === 'index'){
        menuItem.linkId = linkId;
        dirRef = _.merge(dirRef, menuItem);
      }else{
        if(!dirRef.items){
          //console.log(linkId+' dirRef.items not set', dirRef);
          dirRef.items = [];
        }
        // check to see if the item already exists
        if(_(dirRef.items).find({linkId: menuItem.linkId})){
          //console.log('Found match for: ' + menuItem.linkId);
          var defaultItem = _(dirRef.items).find({linkId: menuItem.linkId});
          defaultItem = _.defaults(defaultItem, menuItem);
        }else{
          menuItem.menu_index = dirRef.items.length || 184;
          dirRef.items.push(menuItem);
        }
      }
    }else{
      growBranch(dirRef, pathArr, menuItem);
    }

  }

  /**
   * Customizes a navigation object for use with a particular page
   * by indicating the current page in the navigation and it's parents
   * @param  {object} page     an Assemble page view
   * @param  {object} navLocal a copy of the main navigation object
   * @return {object}          customized navigation object
   */
  function highlightPath(page, navLocal){
    // get assigned menus and loop through
    var menus = getAssignedMenus(page);

    _(menus).forEach(function(menu){
      var pathArr = findMenuPath(page);
      pathArr.push(page.stem);
      var branch = navLocal[menu].items;
      //console.log('pathArr '+ JSON.stringify(pathArr)+'\n');
      scanMenu(pathArr, page, menu, branch, menu);
    });
  }

  /**
   * Recursivly crawl a menu branch and find nodes that
   * match the given page. If a node or it's parent matches
   * update the isCurrentPage and isActive values to true
   * @param  {[type]} pathArr [description]
   * @param  {[type]} page    [description]
   * @param  {string} menu    menu name
   * @param  {[type]} branch  [description]
   * @param  {[type]} linkId  [description]
   * @return {[type]}         [description]
   */
  function scanMenu(pathArr, page, menu, branch, linkId){
    var pageLinkId = generateLinkId(page, menu);
    console.log('Trying to match:', pageLinkId);
    // check current branch for a matching menu item
    var pageRef = _(branch).find({linkId: pageLinkId});
    if (pageRef) {
      console.log('found match for ', pageLinkId);
      // we have a match, mark it as current page
      pageRef['isCurrentPage'] = true;
      return;
    }
    // check if this page is a parent branch for a submenu
    pageLinkId = _s.slugify(menu+' '+path.dirname(page.relative));
    pageRef = _(branch).find({linkId: pageLinkId});
    if (pageRef) {
      console.log('found parent match for ', pageLinkId);
      // we have a match, mark it as current page
      if(page.stem==="index"){
        pageRef['isCurrentPage'] = true;
      }else{
        pageRef['isActive'] = true;
        // menu item is not at this level, try to find a matching parent directory
        var dirname = pathArr.shift();
        var dirLinkId = _s.slugify(linkId+" "+dirname);
        console.log('searching for directory:', dirLinkId);
        var dirRef = _(branch).find({linkId: dirLinkId});
        if (dirRef) {
          dirRef['isActive'] = true;
          scanMenu(pathArr, page, menu, dirRef.items, dirLinkId);
        }
      }
      return;
    }
  }

  /**
   * Recursivly crawl a menu branch and highlight direcories
   * and pages that match the path of a given page.
   * @param  {[type]} pathArr [description]
   * @param  {[type]} page    [description]
   * @param  {string} menu    menu name
   * @param  {[type]} branch  [description]
   * @param  {[type]} linkId  [description]
   * @return {[type]}         [description]
   */
  function crawPath(pathArr, page, menu, branch, linkId){
    // find the directory name at the current level
    var dirname = pathArr.shift();
    console.log('page', page.stem);
    // find the ID of the directory
    if(dirname==='.'){
      linkId = _s.slugify(menu+' '+page.stem);
      console.log('Generated linkId', linkId);
    }else{
      linkId = _s.slugify(linkId+" "+dirname);
      console.log('Extended linkId', linkId);
    }

    // is there a directory with a matching ID
    console.log('Checking '+ linkId+'\n');
    var dirRef = _(branch).find({linkId: linkId});
    if(!dirRef){return;}
    dirRef['isActive'] = true;

    // are there more direcotries to crawl?
    if(pathArr.length){
      crawPath(pathArr, page, dirRef, branch, linkId);
    }
      // is this direcotry the page we're looking for?
      // calculate page's link id
      var pageLinkId = createMenuItem(page, menu).linkId;
      if(pageLinkId === dirRef.linkId){
        dirRef['isCurrentPage'] = true;
      }

      // page must be in this directory, find and highlight it
      var pageRef = _(dirRef).find({linkId: linkId});
      if(!pageRef){return;}
      pageRef['isCurrentPage'] = true;
    
  }

  function menuSort(menu){
    menu.items = _.sortBy(menu.items, 'menu_index');
  }

  /**
   * Hook for assemble:post:pages that scans the pages
   * data to build a navigation data object
   *
   * @param  {object} params - Assemble params
   * @return {Object} navigation object -used for testing
   */
  this.build = function build(params){
    // var testparams = _.cloneDeep(params.assemble.options);
    // testparams.collections.pages = {};
    // grunt.log.write('\n all options: ' + JSON.stringify(testparams, null, '\t')+'\n\n');

    // grab params proerties we want
    var pages     = params.assemble.options.pages;
    var options   = params.assemble.options.navigation || {main:{}};

    // set config options, using defaults
    self.options = parseOptions(options);
    grunt.verbose.write('\n parsed options: ' + JSON.stringify(self.options, null, '\t')+'\n\n');
    grunt.verbose.write('\n pages: ' + JSON.stringify(pages, null, '\t')+'\n\n');

    // start the nav object based on the given config
    self.navigation = startNav();

    // parse the pages array and use it to build navigation
    _(pages).forEach(function(pageObj){
      var pageData = pageObj.data;
      var menus =  getAssignedMenus(pageObj); // finds the menus this page is assigned to
      grunt.verbose.write('\n\n menu for page: ' + pageObj.basename + ' is '+ JSON.stringify(menus) +'\n');

      _(menus).forEach(function(menu){
        var pathArr = findMenuPath(pageObj);
        grunt.verbose.write('add '+ pageData.title + ' to '+ menu + ' at '+ JSON.stringify(pathArr) + '\n');
        var menuItem = attachMenuItem(menu, pageObj);

        addToTree(self.navigation[menu], pathArr, menuItem);
      });
    });

    grunt.verbose.write('\n Navigation before: ' + JSON.stringify(self.navigation, null, '\t')+'\n\n');

    
    // sort menu items recursively
    _(self.navigation).forEach(function(menu, key, collection){
      menuSort(collection[key]);
    });

    //grunt.log.write('\n Navigation after: ' + JSON.stringify(self.navigation, null, '\t')+'\n\n');
    
    // for testing purposes, we'll return the initialized navigation object
    return self.navigation;
  };


  /**
   * Config this instance of navigation
   * @param  {[object} config 
   */
  this.configuration = function configuration(config){
    var options   = config || {main:{}};

    // set config options, using defaults
    self.options = parseOptions(options);

    // start the nav object based on the given config
    self.navigation = startNav();
  };


  this.parsePages = function parsePages(){
    return function (file, next) {
      var menus = getAssignedMenus(file);
      //console.log('parsing view', file.context());
      //console.log('add to menus', menus);

      _(menus).forEach(function(menu){
        var pathArr = findMenuPath(file);
        //console.log('menu path', pathArr);
        var menuItem = createMenuItem(file, menu);
        //console.log('menu item', menuItem);
        addToTree(self.navigation[menu], pathArr, menuItem);
      });

      next();
    };
  };

  this.sortMenus = function sortMenus(){
    // sort menu items recursively
    _(self.navigation).forEach(function(menu, key, collection){
      menuSort(collection[key]);
    });
  };

  this.inject = function inject(){

    return function (file, next) {
      //console.log('inject into: ', file.path);
      //console.log('View data: ', file.data);

      // make a deep copy of the navigation object
      var navLocal = _.cloneDeep(self.navigation);

      // alter our copy to indicate current page and it's parents
      highlightPath(file, navLocal);

      // attach revised nav to our page's context
      file.data = merge({}, {'navigation': navLocal}, file.data);
      //file.context(context);
      //console.log('View data Post: ', file.data);
      next();
    };
  };
};

module.exports = new navMethods();
