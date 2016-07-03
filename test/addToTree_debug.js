/**
 * copying code from addToTree_test.js so I cn debug it
 */

// node builtins
var path = require('path');

// npm modules
var expect = require('chai').expect;
var _ = require('lodash');

var assemble = require('assemble');
var app;
var navi = require('../lib/navigation');
var createMenuItem = navi._testMethods().createMenuItem;
var addToTree = navi._testMethods().addToTree;

app = assemble();
if (!app.pages) {
  app.create('pages');
}

app.pages.onLoad(/\.hbs$/, navi.parsePages());

navi.configuration({main: {
  items: [
    {
      linkId: "main-media",
      items: [
        {
          linkId: "main-media-news"
        }
      ] 
    }
  ]
}});

var pages = app.pages('test/fixtures/addToTree/**/*.hbs');
app.toStream('pages')
  .pipe(app.renderFile());
console.log('main menu', JSON.stringify(navi.navigation.main, null, '\t'));

// find items under main-media
var mediaMenuItem = _.find(navi.navigation.main.items, function(o){
  return o.linkId === 'main-media';
});

console.log('mediaMenuItem', JSON.stringify(mediaMenuItem, null, '\t'));
//expect(mediaMenuItem).to.have.ownProperty('items');
//expect(mediaMenuItem.items).to.have.length.above(0);