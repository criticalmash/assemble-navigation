#Navigation generator plugin for Assemble

> Note: This 0.3 branch is a public-beta designed to be used with Assemble v0.11+. Depending on feedback and testing, I might have to make breaking changes to the API.
> Otherwise, feel free to use it and [share your thoughts](https://github.com/criticalmash/assemble-navigation/issues).

##What is Assemble?
[From the Assemble Repository →](https://github.com/assemble/assemble)
> Get the rocks out of your socks! Assemble makes you fast at creating web projects. Assemble is used by thousands of projects for rapid prototyping, creating themes, scaffolds, boilerplates, e-books, UI components, API documentation, blogs, building websites / static site generator, alternative to jekyll for gh-pages and more! Assemble can also be used with gulp and grunt.

Assemble-navigation is a middleware collection to generate and inject hierarchal navigation data into a page's context. That page can then use a template or partial to build any kind of menu.

I've also created a collection of [navigation-helpers](https://github.com/criticalmash/navigation-helpers) to make building menus and breadcrumbs easier. But you can use any template helpers you like.

## How it works

Every page object that passes through Assemble's build process contains meta data about it's location in the file hierarchy of the source directory, which can also be the hierarchy of the destination directory as well. Assemble-Navigation exploits this relationship between files to help automate your menu creation process.

The directory hierarchy of the site is used to infer the navigation hierarchy. For example, if the site root has a directory named "products", we likely want the main navigation to have a "Products" link with the directory's children listed below as links in a dropdown.

The middleware parses the page views as Assemble loads files and creates a hierarchal navigation object that is then added back into each page's data object before rendering. This navigation object contains all the information needed to render attractive menus.

The site builder can then create templates that use these objects to build menu's of their choosing.

Assemble navigation uses sensible defaults that can be overridden in the `Assemblefile.js` file, front-matter, etc. By default, the Assebmle-Navigation creates one menu called `main` and place all pages into it. The site builder can override this default by adding a new menu called `footer`, and then update the front-matter of some pages to indicate that the page belongs in `footer` instead of `main`. Similar methods can be used to specify a custom sort order, use an alternative title in the menu, etc.

The data passed to each page's template is altered for each page to indicate the current page and it's parents.

[More details](https://github.com/assemble/assemble/issues/462)

##Installation

Install via npm

```
npm i assemble-navigation --save
```

Requires Assemble 0.11 or later.

> Note: a set of template helpers are in development to make some tasks easier. A demo site with source code is also in the works. Keep an eye on this space for updates.

## How To Use

###Basic Configuration Using Defaults

>These instructions assume that you have a basic understanding of *Gulp style* [Assemble](https://github.com/assemble/assemble). Using this package will be vastly easier if you first understand how to build a basic Assemble site.

Assemble-navigation is designed to work with almost-zero configuration. It infers the navigation hierarchy from the directory structure of the site. What you have to do is configure Assemble to use the middleware. That's done requiring Assemble-Navigation and setting it up as a middleware.

```javascript
var assemble = require('assemble');
var Navigation = require('assemble-navigation');

var app = assemble();

var navigation = new Navigation();

app.pages.onLoad(/\.hbs$|\.md$/, navigation.onLoad());
app.pages.preRender(/\.hbs$|\.md$/, navigation.preRender());

/* a sample task */
app.task('content', function () {
  /* clear out any old data (important during development) */
  navigation.clearMenus();
  /* `src/content` would be designated as the cwd */
  app.pages('src/content/**/*.{md,hbs}');
  return app.toStream('pages')
    .pipe(app.renderFile())
    .on('err', console.error)
    .pipe(extname())
    .pipe(app.dest('build'));
});

```
By default, the next time the Assemble loads view onto the `page` collection, the `onLoad` middleware will build your navigation object. When Assemble prepares to render the pages, the `preRender` middleware creates a copy of the navigation object adds it to the data attribute of each page it generates. Once in the view, you can use the data it supplies in any way you need. For example...

```html
<ul>
{{#each navigation.main.items }} 
    <li><a href="{{{url}}}" >{{{title}}}</a></li>
{{/each  }} 
</ul>
```

this will create a list of links for all the pages in your site root (using the default config).

The navigation data looks something like this...

```json
{
  "main": {
    "items": [
      {
        "title": "home page",
        "url": "/index.html",
        "linkId": "index",
        "isCurrentPage": false,
        "isActive": false,
        "data": {
          "title": "home page",
          "ext": ".hbs"
        },
        "items": [],
        "menuPath": [
          "."
        ],
        "basename": "index"
      },
      {
        "title": "About Us",
        "url": "/about.html",
        "linkId": "about",
        "isCurrentPage": false,
        "isActive": false,
        "data": {
          "title": "About this site",
          "menu-title": "About Us",
          "ext": ".md"
        },
        "items": [],
        "menuPath": [
          ".",
          "about"
        ],
        "basename": "about"
      },
      {
        "title": "products",
        "url": "/products/index.html",
        "linkId": "products-index",
        "isCurrentPage": false,
        "isActive": false,
        "data": {
          "title": "products",
          "ext": ".md"
        },
        "items": [
          {
            "title": "Cameras and Video",
            "url": "/products/cameras.html",
            "linkId": "products-cameras",
            "isCurrentPage": false,
            "isActive": false,
            "data": {
              "title": "Cameras and Video",
              "ext": ".hbs"
            },
            "items": [],
            "menuPath": [
              "products",
              "cameras"
            ],
            "basename": "cameras"
          },
          {
            "title": "Computing Equipment",
            "url": "/products/computers.html",
            "linkId": "products-computers",
            "isCurrentPage": false,
            "isActive": false,
            "data": {
              "title": "Computing Equipment",
              "ext": ".hbs"
            },
            "items": [],
            "menuPath": [
              "products",
              "computers"
            ],
            "basename": "computers"
          },
          {
            "title": "Storage Media",
            "url": "/products/media.html",
            "linkId": "products-media",
            "isCurrentPage": false,
            "isActive": false,
            "data": {
              "title": "Storage Media",
              "ext": ".hbs"
            },
            "items": [],
            "menuPath": [
              "products",
              "media"
            ],
            "basename": "media"
          }
        ],
        "menuPath": [
          "products"
        ],
        "basename": "index"
      }
    ]
  }
}
```

What you see above is the navigation object containing one menu, named *main*, that contains all the site's root items inside an array named *items*. The `products` menu item contains three children items inside it's `items` array. Creating a menu in HTML is as simple as looping over series of items with your templates.

### Anatomy of a Menu Item
Assemble-Navigation provides three types of objects. The `navigation` object contains all your site's menus as instances of the `menu` object. Each menu can contain one or more `menuItem	` objects, which can also contain child `menuItem` objects (and so-on and so-forth). This data structure allows the creation of many levels and types of menus schemes.

While it might look complicated at first glance, by understanding how `menuItem` objects work, you can quickly grasp the basics of putting them to use.

Here's an example from the menu shown above, the Products index page.

```json
{
	"title": "Products",
	"url": "/products/index.html",
	"linkId": "products-index",
	"isCurrentPage": false,
	"isActive": false,
	"data": {
	  "title": "Products",
	  "ext": ".md"
	},
	"items": [ OBJECT, OBJECT, OBJECT],
	"menuPath": [
	  "products"
	],
}
```

We'll walk through each of it's attributes and describe their purpose and use.

#### title
Title represents the title of the page and can be used as the link text that's rendered in the menu. By default, the title is pulled from the file's name (aka, the stem value or the filename minus the extension). This can be overridden by setting a `title` or `menu-title` value in the page's front matter.

#### url
Used as a root relative path in any `href` attributes. The URL is based on the source file's relative path in the current working directory (CWD) used to load the files. The extension is rewritten.

#### linkId
A unique identifier for the menuItem. Only unique to other items in the menu, other menu's might have menuItems with the same ID. If you use this attribute to create an HTML ID attribute, you might want to append a sting to it to guarantee uniqueness.

#### isCurrentPage && isActive
Before injecting a copy of a navigation into a page view. Assemble-Navigation crawls the menu's and *highlights* the current page if it appears in that menu by setting `isCurrentPage` to true. Any parent items will also have their `isActive` attribute set to true. You can use this to add css classes to the menu items. These attributes can also be used to create breadcrumbs by crawling the menu and following isActive attributes.

#### data
A copy of the view's data attribute. If you need to pass custom values to the menu template, it's as easy as setting them in the page's front matter.

#### items
An array of the menu item's children (if any).

#### menuPath
Used internally by Assemble-Navigation to create menu hierarchies.

### Creating Custom Menu Items
Sometimes, you need menu items that don't come from you're Assemble app's pages. For example, you might need to link to another site or link to a downloadable file like a PDF.

#### Using `.customMenuItem(config)`
Creates a custom menuItem without the use of a view. Could be used to link to a third-party site or to a file (PDF, etc.) that isn't a view.

```js
/* link to an outside site */
navigation.customMenuItem({
	title: 'Our Friend`s Site',
	url: 'http://example.com',
	menuPath: 'about/friends',
	menu: 'main',
	data: {target: '_blank'}
});

/* link to PDF */
navigation.customMenuItem({
	title: 'Sales Brochure',
	url: '/downloads/pdf/salesbrochure.pdf',
	menuPath: 'info/downloads',
	linkId: 'sales-brochure-link
});
```

**Config Attributes:** 

- `title` {string} The menu link text
- `url` {string} link target
- `menuPath` {string} Placement location in the menu hierarchy. Leave out if link belongs in top nav
- `menu` {string} String or array indicating which menu(s) item appears in. Leave out to use default.
- `data` {object} 

You'll most likely would want to call `customMenuItem` config from within a task.

###Specifying Additional or Alternative Menus

Having just one menu on our page is boring. Fortunately, we can add more when creating an instance of the `Navigation` object. Assemble Navigation's configuration is changed by passing a config object when creating an instance of the `Navigation` object.

```javascript
var navigation = new Navigation({'menus': ['header', 'footer'], 'default': 'header'});
```

Above, we just added two menus to our navigation, *footer* and *features*. When overriding the defaults, if you want to keep the *main* menu, you must also add it to your config. Also, the config object has a *default* attribute set to `main`, so that pages are assigned to it unless specified.

Now, our customized navigation looks like this...

```json
{
    "main": {
        "items": [
          {
              "title": "About",
              "url": "/about.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-about",
              "menu_index": 0
          },
          {
              "title": "Welcome to Our Home Page with a Very Long Title",
              "url": "/index.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-index",
              "menu_index": 1
          },
          {
              "title": "New Products",
              "url": "/newproducts.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-newproducts",
              "menu_index": 2
          },
        ]
    },
    "footer": {
        "items": []
    },
    "features": {
        "items": []
    }
}
```

Now that we have two new menus (and an additional page), let's add some pages to the other menus and do something about that ridiculously long title.

###Configuring Page and Link Attributes

Let's say we want to deemphasize the About page and make the New Products page a featured page. A links menu and settings can be changed by adding options to the YAML front matter of the corresponding page. Assemble Navigation already takes advantage of the commonly used custom variable `title` to set the link's title. (If `title` is not set, Navigation uses the page's basename, e.g. *index* for *index.html*.) 

To assign a page to another menu, we simply set it's menu property.

```data
---
title: About
menu: footer
---
```

Now, *About* will appear in the footer. We can also assign a page to more than one menu.

```data
---
title: New Products
menu: 
    - main
    - features
---
```

Finally, we want our homepage link to have a shorter title. We can do this by setting it's *menu-title* variable.

```data
---
title: Welcome to Our Home Page with a Very Long Title
menu-title: Home
---
```

At this point, our navigation object should look like this...


```json
{
    "main": {
        "items": [
          {
              "title": "Home",
              "url": "/index.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-index",
              "menu_index": 0
          },
          {
              "title": "New Products",
              "url": "/newproducts.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-newproducts",
              "menu_index": 1
          },
        ]
    },
    "footer": {
        "items": [
          {
              "title": "About",
              "url": "/about.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "footer-about",
              "menu_index": 0
          }
        ]
    },
    "features": {
        "items": [
          {
            "title": "New Products",
            "url": "/newproducts.html",
            "isCurrentPage": false,
            "isActive": false,
            "linkId": "features-newproducts",
            "menu_index": 0
          }
        ]
    }
}
```

About is relegated to the gutter of our page and New Products now appears twice.

### Creating a responsive menu from the `data.navigation` object

A demo site with a public github repo is in the works. For now, here's an example of a handlebars partial using the `data.navigation` attribute to create a [Zurb Foundation](http://foundation.zurb.com) top-bar component based on a site's `main` menu.

```handlebars
<div class="title-bar" data-responsive-toggle="page-top-bar" data-hide-for="medium">
  <button class="menu-icon" type="button" data-toggle></button>
  <div class="title-bar-title" data-toggle>Navigation Demo</div>
</div>
<div class="top-bar" id="page-top-bar">
  <div class="row">
    <div class="top-bar-left">
      <ul class="drilldown menu" data-responsive-menu="drilldown medium-dropdown">
        <li class="menu-text"><a href="/">Navigation Demo</a></li>
        {{#each navigation.main.items }}
          {{#compare linkId "!=" 'index'}}
            {{#if items.length}}
              <li class="has-dropdown{{#if isCurrentPage}} current-page{{/if}}" data-linkid="{{linkId}}">
                <a href="{{{url}}}" >{{{title}}}</a>
                <ul class="menu vertical">
                  <li class="{{#if isCurrentPage}}current-page{{/if}}"  data-linkid="{{linkId}}"><a href="{{{url}}}" >{{{title}}}</a></li>
                  {{#each this.items}}
                    <li class="{{#if isCurrentPage}}current-page{{/if}}"  data-linkid="{{linkId}}"><a href="{{{url}}}" >{{{title}}}</a></li>
                  {{/each}}
                </ul>
              </li>
            {{else}}
              <li class="no-dropdown {{#if isCurrentPage}}current-page{{/if}}"  data-linkid="{{linkId}}"><a href="{{{url}}}" >{{{title}}}</a></li>
            {{/if}}
          {{/compare}}
        {{/each}}
      </ul>
    </div>
  </div>
</div>
```

Inside the base component markup, we see a handlebars `each` helper that loops over the menu items of the `main` menu's items array. The [compare](https://github.com/assemble/handlebars-helpers#compare) helper is used to skip the homepage (a link to home is used elsewhere in the top-bar). The menu item is then tested to see if it has any children, if so a drop down is rendered and the children are added. Otherwise, a link without a dropdown is created.

This example implements Foundation to create the navigation, but using using another front-end framework would be just as simple.

> Note: this example doesn't include any means of sorting links. Future versions of Assemble-Navigation will include some means of specifying an order. Also the upcoming template helper package will contain some functionality to help sort menu items.
 
### Sorting And Ordering Menu items
By default, the only ordering Navigation does is to make sure that index pages are at the front/top of any items array. The rest of the items appear in the order they arrive, which is usually alphabetical. There are two ways you can define the ordering of your menus...

* In the templates you can sort menu items before rendering
* In your AssembleFile using a sorting function

Both of these methods use the attributes in your menu items.

#### Sorting inside templates
 In your templates, you can use helpers to sort items before looping over them. See [Navigation-Helpers](https://github.com/criticalmash/navigation-helpers) and [Handlebars-Helpers](https://github.com/assemble/handlebars-helpers) for some useful template helpers.

Any value exposed by a MenuItem can be used for sorting or filtering, an especially useful method is to add a sorting field to the front matter of pages that you want to sort.

The next version of Assemble-Navigation will have a means to order menu items inside the config object used when declaring a Navigation instance. See the [Issue Queue](https://github.com/criticalmash/assemble-navigation/issues) for this and other enhancements.

#### Creating a sorting function
A sorting function is passed to a menu after all views are loaded and before rendering. It's similar to using JavaScripts [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) function but with two significant differences:

* The function is applied to the menu and any submenus recursively.
* A reference to the parent item of the two siblings being compared is also passed into the function.

Here's an example of a simple sort function that orders menu items by title. 

```js
// Your sorting function
function sortByTitle (menuItem_a, menuItem_b, parent) {
  if(menuItem_a.title > menuItem_b.title){
    return 1;
  }
  if(menuItem_a.title < menuItem_b.title){
    return -1;
  }
  return 0;
}
// sort the main menu
navigation.menus.main.sort(sortByTitleOrSpecial);
``` 
The `parent` parameter is useful when you want to use different sorting strategies for different menus. For example, you can use an Alpha-by-Title sort for your products page and sort blog posts using a timestamp value in the post's front matter. See the tests file [sort-spect.js] for examples.

 
## Release History
### v0.4.0
Added sorting mechanism. Removed Vinyl as a peer dependency for MenuItem creation.

### v0.3.0
Beta release

## Contributing and Issues
Feel free to submit issues or pull requests for [assemble-navigation](https://github.com/criticalmash/assemble-navigation/issues). Questions on use can also be submitted to the issue queue.

There's a suite of unit tests. ```mocha test/*-spec.js```

## License
© 2016 John O'Donnell (Critical Mash Inc.) Released under the [MIT license](https://github.com/criticalmash/assemble-navigation/blob/master/LICENSE-MIT).
