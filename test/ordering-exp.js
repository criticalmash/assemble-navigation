/**
 * Experimetns to test various ordering methods
 */

var _ = require('lodash');

var list = [
  {name: 'Home', position: 0},
  {name: 'About', position: 2},
  {name: 'Bananas', position: 1},
  {name: 'Contact', position: 5}
];

console.log('before', list);

list = _.orderBy(list, ['position', 'name']);


console.log('after', list);


var newItem = {name: 'newItem', position: 3};

var newIndex = _.sortedIndexBy(list, newItem, 'position');

console.log('newIndex', newIndex);

list.splice(newIndex, 0, newItem);

console.log('final', list);