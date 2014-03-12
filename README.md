#Navigation generator plugin for Assemble

##What is Assemble?
[From the Assemble Website →](http://assemble.io)
> Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.

Assemble-navigation is a plug-in to generate and inject hierarchal navigation data into a page's context. That page can then use a template or partial to build any kind of menu.

Working spec below

##Here's what I'm thinking how such a plug-in might work…

The directory hierarchy of the site would be used to infer the navigation hierarchy. For example, if the site root has a directory named "products" then the main navigation might have a "Products" link with the directory's children listed below as links.

The plug-in would parse the pages array from the context data to build a hierarchal navigation object that is then added back into the context.

The site builder can then pass that navigation object to a template / partial to build the menu.

The plug-in would have sensible defaults that can be overridden in the task config, front-matter, etc. By default, the plug-in might create one navigation called "main" and place all pages into it, sorted by page title. The site builder could override this default by adding a new navigation called "footer", and then update the front-matter of some pages to indicate that the page belongs in "footer" instead of "main". A similar method could be used to specify a custom sort order, use an alternative title in the menu, etc.

The data passed to each page's template would also be altered for each page to indicate the current page and it's parents.

[More details](https://github.com/assemble/assemble/issues/462)

##Installation

When ready will be available via npm

Requires Assemble (and grunt)

## How to use

###Basic configuration using defaults

>These instructions assume that you have a basic understanding of [Grunt](http://gruntjs.com/getting-started) and [Assemble Website](http://assemble.io/docs/). Using this plug-in (and Assemble as well) will be vastly easier if you first understand [Dynamic Mappings](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically), especially the *expand* and *cwd* options.

Assemble-navigation is designed to work with almost-zero configuration. It infers the navigation heirarchy from the directory structure of the site. What you have to do is let Assemble know to use the plugin. That's done by adding the plug-in to the Grunt config for Assemble.

```javascript
assemble: {
    options: {
        plugins: ['assemble-navigation']
    }
}
```
By default, the next time the Assemble task runs, the plug-in will build your navigation object and add it to the context of each page it generates. Once in the context, you can use the data it supplies in any way you need. For example...

```html
<ul>
{{#each navigation.main.items }} 
    <li><a href="{{{url}}}" >{{{title}}}</a></li>
{{/each  }} 
</ul>
```

this will create a list of links for all the pages in your site (using the default config).

Currently, the navigation data passed to templates is changing as the API is fleshed out. But right now, it looks something like this...

```json
{
    "main": {
        "items": [
          {
              "title": "About",
              "url": "/about.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-about"
          },
          {
              "title": "Welcome to Our Home Page with a Very Long Name",
              "url": "/index.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-index"
          }
        ]
    }
}
```

What you see above is the navigation object containing one menu, named *main*, that contains all the site's pages inside an array named *items*. This format can be easily altered by overriding the defaults in the Grunt config file.

###Specifying Additional or Alternative Menus

Having just one menu on our page is boring. Fortunately we can add more via the Grunt config. Assemble navigation's configuration is changed by adding a *navigation* property to Assemble's options object.

```javascript
assemble: {
    options: {
        plugins: ['assemble-navigation'],
        navigation: {
            main: {default:true},
            footer: {},
            features: {}
        }
    }
}
```

Above, we just added two menus to our navigation, *footer* and *features*. When overriding the defaults, if you want to keep the *main* menu, you must also add it to your config. Also, the *main* object has it's *default* flag set to true, so that pages are assigned to it unless specified.

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
              "linkId": "main-about"
          },
          {
              "title": "Welcome to Our Home Page with a Very Long Title",
              "url": "/index.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-index"
          },
          {
              "title": "New Products",
              "url": "/newproducts.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-newproducts"
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

###Configuring page and link attributes

Let's say we want to deemphasize the About page and make the New Products page a featured page. A links menu and settings can be changed by adding options to the YAML front matter of the corresponding page. Assemble Navigation already takes advantage of the commonly used custom variable *title* to set the link's title. (If *title* is not set, Navigation uses the page's basename, e.g. *index* for *index.html*.) 

To assign a page to another menu, we simply set it's menu property.

```data
---
title: About
menu: footer
---
```

Now, About will appear in the footer. We can also assign a page to more than one menu.

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
              "linkId": "main-index"
          },
          {
              "title": "New Products",
              "url": "/newproducts.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-newproducts"
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
                "linkId": "main-about"
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
              "linkId": "main-newproducts"
          }
        ]
    }
}
```

About is relegated to the gutter of our page and New Products now appears twice.
