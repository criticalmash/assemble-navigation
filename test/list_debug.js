// node builtins
var path = require('path');

// contrib modules
var assemble = require('assemble');
var App = assemble();
    if (!App.pages) {
      App.create('pages');
    }

var List = App.List;
var Views = App.Views;
var list, views;


// items for testing
var items = [
  { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
  { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
  { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
  { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
  { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
  { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
  { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
  { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
  { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
  { path: 'm.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
  { path: 'b.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
  { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
  { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } }
];


list = new List();
list.addList(items);

//console.log('full list', JSON.stringify(list, null, '\t'));

var grouped = list.groupBy('locals.foo');

//console.log('grouped list', JSON.stringify(grouped, null, '\t'));

var context = list
  .sortBy('locals.date')
  .groupBy(function(view) {
    var date = view.locals.date;
    view.locals.year = date.slice(0, 4);
    view.locals.month = date.slice(5, 7);
    view.locals.day = date.slice(8, 10);
    return view.locals.year;
  }, 'locals.month');

var keys = Object.keys(context);

console.log('grouped by date', JSON.stringify(context, null, '\t'));
