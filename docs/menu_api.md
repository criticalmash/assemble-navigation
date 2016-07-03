#Menu API
The navigation object contains one or more menus. Menu's are are hierarchal collection of menu items (links with meta data). The hierarchy of the menu should reflect the hierarchy of the site.

##Methods

###Menu()

Creates a new menu object and assigns it a name.

```javascript
var menu = new Menu(menuName);
```

### addItemToMenu()
Adds a menu item to the menu,

```javascript
menu.addItemToMenu(menuItem);
```

Menu API will inspect the menu item and find the appropriate place in the hierarchy for it.

### findByLinkId()
Searches the hierarchy and returns the first matching menu item, returns undefined if there's no match.
> Note: linkIds should be unique.

```javascript
var homepage = menu.findByLinkId('main-index');
```

### toJSON()
Dumps the menu's data structure as JSON. Useful for debugging.

```javascript
var menuData = menu.toJSON();
```

### copyMenu()
Returns a deep copy of the menu that's injected into a page's data attribute