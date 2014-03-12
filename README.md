#Navigation generator plugin for Assemble

##What is Assemble?
[From the Assemble Website →](http://assemble.io)
> Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt, Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.

Assemble-navigation is a plugin to generate and inject heirarchal navigation data into a page's context. That page can then use a template or partial to build any kind of menu.

Working spec below

##Here's what I'm thinking how such a plugin might work…

The directory hierarchy of the site would be used to infer the navigation hierarchy. For example, if the site root has a directory named "products" then the main navigation might have a "Products" link with the directory's children listed below as links.

The plugin would parse the pages array from the context data to build a hierarchal navigation object that is then added back into the context.

The site builder can then pass that navigation object to a template/partial to build the menu.

The plugin would have sensible defaults that can be overridden in the task config, front-matter, etc. By default, the plugin might create one navigation called "main" and place all pages into it, sorted by page title. The site builder could override this default by adding a new navigation called "footer", and then update the front-matter of some pages to indicate that the page belongs in "footer" instead of "main". A similar method could be used to specify a custom sort order, use an alternative title in the menu, etc.

The data passed to each page's template would also be altered for each page to indicate the current page and it's parents.

[More details](https://github.com/assemble/assemble/issues/462)

##Installation

When ready will be available via npm

Requires Assemble (and grunt)

## How to use

###Basic config using defaults

Assemble-navigation is designed to work with almost-zero configuration. It infers the navigation heirarchy from the directory structure of the site. What you have to do is let Assemble know to use the plugin. That's done by adding the plugin to the Grunt config for Assemble.

```javascript
assemble: {
    options: {
        plugins: ['assemble-navigation']
    }
}
```
By default, the next time the Assemble task runs, the plugin will build your navigation object and add it to the context of each page it generates. Once in the context, you can use the data it supplies in any way you need. For example...

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

What you see above is the navgation object containing one menu, named *main*, that contains all the site's pages inside an array named items. This format can be easily altered by overridding the defaults in the Grunt config file.

###Specifing Additional or Alternative Menus

Having just one menu on our page is boring. Fortunatly we can add more via the Grunt config. Assemble navigation's configuration is changed by adding a *navigation* property to Assemble's options object.

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

Above, we just added two menus to our navigation, **footer** and **features**. When overiding the defaults, if you want to keep the **main** menu, you must add it to your config. Also, the **main** object has it's **default** flag set to true, so that pages are assigned to it unless specified.

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
              "title": "Welcome to Our Home Page with a Very Long Name",
              "url": "/index.html",
              "isCurrentPage": false,
              "isActive": false,
              "linkId": "main-index"
          }
        ]
    },
    "footer": {
        "items": []
    },
    "features": {
        "items": []
    }
}


