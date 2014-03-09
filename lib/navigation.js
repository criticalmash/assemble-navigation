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
//var _   = require('lodash');


// navigation data
var navigation = {};

// default navigation config
var template = {
  items: []
};

function parseOptions(optionsIn){
  var optionsOut = {};

  return optionsOut;
}

/**
 * Hook for assemble:post:pages that scans the pages
 * data to build a navigation data object
 *
 * @param  {object} params - Assemble params
 * @return {Object} navigation object -used for testing
 */
function buildNav(params){
  //grunt.log.write(JSON.stringify(params, null, '\t')+'\n\n');

  // grab params proerties we want
  var assemble  = params.assemble;
  var pages     = assemble.options.pages;
  var options   = assemble.options.navigation || {};

  // set config options, using defaults

  // see if options defines alternative navigation


  // parse the pages array and use it to build defaults

  // for testing purposes, we'll return the navigation object
  return navigation;
}

function injectNav(params){
  // get information on the current page

  // make a copy of the navigation object

  // alter our copy to indicate current page and it's parents

  // attach revised nav to our page's context
}

var navMethods = {
  build: buildNav,
  inject: injectNav
};

module.exports = navMethods;
