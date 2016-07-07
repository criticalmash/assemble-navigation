# Navigation API

The navigation object represents all the menu's in your assemble app. It provides methods to add and edit menu's and menu items to your navigation and middleware for automatically doing the same.


## Middleware
Middleware provides the quickest way to add navigation to your site. Assemble middleware is called in particular phases of the build cycle. The navigation middleware is called in two of these phases.

### onLoad
When a page (or other renderable view) has just been added to a collection. At this point, Navigation processes the page object and creates a menuItem that's added to the appropriate menu(s).

### preRender
This phase runs just before pages are passed to the Assemble renderer function. For each page, Navigation creates a copy of the main nav object and flags the current page and it's parents. Then adds this copy to the page object. This allows a navigation template to add special classes to the item during rendering.

```js
var Navigation = require('assemble-navigation');
var navigation = new Navigation();
app.pages.onLoad(/\.hbs$/, navigation.onLoad());
app.pages.preRender(/\.hbs$/, navigation.preRender());
```

## Using Navigation in Templates
Assemble-Navigation adds a navigation object to each page's context that you can use in your templates to generate hierarchal menu's.

## API

### Navigation([config])
Navigation constructor, allows you to create multiple navigations in case you're generating multiple sites in one App. Accepts an optional config object.

```js
var navigation = new Navigation();
```

**Navigation Config Variables**

```js
var navigation = new Navigation({
	'menus': ['main'], // an array of menus
	'default': 'main', // name of default menu
});
```

### .menus
An object hash of menu objects, index by name.

```js
var menus = navigation.menus;
// => {
	'main': {
		'items': []
	}
}
```

### .defaultMenu([menuName])
Returns the name of the default menu. If a string is passed, will set that name as the new default.

### .createMenu(menuName)
Creates a new menu with the name `String`. The new menu is then added to the navigation object.

```js
navigation.createMenu('footer');
```

### .highlightPath(view, naviCopy)
Localizes a copy of the main navigation object by flagging the active path to the page indicated in view.

# Sample usage

**assemblefile.js**

```js
var assemble = require('assemble');
var Navigation = require('assemble-navigation');
var app = assemble();
var navigation = new Navigation();

/* config navigation */
navigation.createMenu('footer');

app.pages.onLoad(/\.hbs$/, navigation.onLoad());
app.pages.preRender(/\.hbs$/, navigation.preRender());
```

**Source file**

```handlebars
---
title: page title in header
menu:  
  - main
  - footer
menu-title: Page title in menu
menu-path: dirName/subdir
menu-sort: 10
---
Content goes here
```

# onLoad() Process Workflow
Description of how a view is turned into a menuItem and placed in the navigation hierarchy.

1. Middleware function called:
Function receives a view (vinyl file object) and a callback. Middleware needs to:
  1. Find menu's the item belongs to
  2. For each menu, creates a menu item from the view
  3. Pass that menu item to the menu(s), which will then find and add the menu item to the appropriate spots in the hierarchy.
2. `Navigation.getAssignedMenus()`
  1. Accepts either a `view` object or a `menuItem`
  2. Returns an array of menu names. If the view/item doesn't have any menu's indicated, function returns the default menu. If the view has menu names that are not part of the menuList
3. `new MenuItem(view, menu)` called
	1. Accepts a view object and menu name
	2. Returns a menuItem instance
4. `menu.addItem(menuItem)`: Menu object takes over from here.












