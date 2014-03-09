/*
 * Assemble Plugin: assemble-contrib-navigation
 * https://github.com/criticalmash/assemble-contrib-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 * This plugin provides context data to build a heirarchal navigation for an Assemble site
 *
 *
 * Copyright (c) 2014 criticalmash
 * Licensed under the MIT license.
 */


var navigation = require('navigation');



/**
*   The plugin needs to react to two different events/stages
*   'assemble:post:pages', is when we build the navigation
*   'render:pre:page'  is when we alter nav to fit a given page
*   we'll register to receive all stages and inspect the stage
*   to see what we need to do
*/
var options = {
  stage: '*:*:*'
};

var plugin = function(params, next) {
  'use strict';

  if (params.stage === 'assemble:post:pages') {
    // pages have been built, so let's scan them for menu items
    navigation.build(params);
  } else if (params.stage === 'render:pre:page') {
    // a page needs navigation items
    navigation.inject(params);
  }
  next();
};


// export options
plugin.options = options;
module.exports = plugin;
