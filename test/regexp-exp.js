//regexp-exp.js
/**
 * testing various means of removing a slash from begining of string
 */

var path1 = '/media/news/latest-news.html';
var path2 = 'media/news/latest-news.html';

var regx1 = /^(\/)/;

// var regx2 = /^\/|\/$/g

console.log('1: ', path1.replace(regx1, ''));
console.log('2: ', path2.replace(regx1, ''));