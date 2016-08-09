#Menu API
The navigation object contains one or more menus. Menu's are are hierarchal collection of menu items (links with meta data). The hierarchy of the menu should reflect the hierarchy of the site.

## New menu item workflow
Navigation's onLoad middleware creates new menuItems for each view processed then calls the `addItem()` method for each designated menu. From there, it's up to each menu object to find the appropriate spot to store the menuItem.

1. `.addItem(menuItem)` called
2. addItem retrieves the menu root and the items `menuPath` value.
3. calls `.placeItem(menuRoot, menuPath, menuItem)`

## Methods

### Menu()

Creates a new menu object and assigns it a name.

```javascript
var menu = new Menu(menuName);
```

### .addItem(menuItem)
Adds a menu item to the menu,

```javascript
menu.addItem(menuItem);
```

Menu API will inspect the menu item and find the appropriate place in the hierarchy for it. If the item's navigation path indicates a non-existing path, the path will be created and populated with stub menu items.

### .placeItem(menuBranch, menuPath, menuItem)
Recursively searches the menu for a spot that matches the menuItem's menuPath. As matching branches are found they're popped off of menuPath and the function then calls itself recursively with the subbranch.

If a subbranch does not (yet) exist, `stubMenuItem` will be called to create one.

### .stubMenuItem()
Creates a new MenuItem to act as a placeholder in the navigation.

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


## Sorting Menu Items
Goals

* Provide sensible defaults
    * `index` first
    * Then alphabetically by title
* Make them easy to change
    * menuIndex variable inside front matter
    * Menu ordering via `Navigation` config object
    * Sorting via helpers like `CollectionQuery`
* Have them sort in a predictable and repeatable way

