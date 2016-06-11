/*
 * Assemble Plugin: assemble-navigation
 * https://github.com/criticalmash/assemble-navigation
 * Assemble is the 100% JavaScript static site generator for Node.js, Grunt.js, and Yeoman.
 * This plugin provides context data to build a heirarchal navigation for an Assemble site
 *
 *
 * Copyright (c) 2014 criticalmash
 * Licensed under the MIT license.
 */


var navigation = require('./lib/navigation');




/**
 * Provides a function that takes an Assemble app object and a config object 
 * adds two peices of middleware to the assemble app
 *
 * parsePages: attches to the onLoad route and parses each view that passes
 * through it. That view is added to the navigation object
 *
 * inject: attaches to the preRender route and adds a customized navigation
 * object to each view before rendering. It's up to the end user to create a
 * layout or partial that can turn that data into a working menu
 *
 */

// var navRouting = function(app, config){
//   //navigation.configuration(config);
//   app.pages.onLoad(/\.hbs$/, navigation.parsePages());
//   app.pages.preRender(/\.hbs$/, navigation.inject());
//   //this.sample = navigation.navigation;
// };

module.exports = navigation;