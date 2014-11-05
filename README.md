# ti-selector

Simple selector for Titanium's native view elements.

## Intent

Provide a way to easily retrieve specific elements from the Titanium views.

The library will be limited to an intentionally limited subset of the css selector syntax.

## How to install

 * Copy ```build/ti-selector.js``` in your application's ```lib``` folder.
 * Require it as you would with any CommonJS modules

```js
var selector = require('ti-selector');
```

## Build system

The build system is based on gulp and a few modules which are included as local dev dependencies.
There's no need to install gulp globally, but installing the dependencies is necessary.

```npm install```

Once this is done, run the build script.

```npm run build```

You don't need to use the build system if you are not taking part in the development of the library.
You can simply use the build provided in the repository.

## Public API

 * selector(element, query) and selector.getElements(element, query)
 * selector.getElement(element, query)
 * selector.getParents(element, query)
 * selector.getParent(element, query)
 * selector.getSiblings(element, query)
 * selector.getSibling(element, query)

[API documentation](https://github.com/kchapelier/ti-selector/blob/master/API.md)

## Changelog

### 1.0.0 (2014.11.05) :

 * Enforce code style with jscs
 * Support for tableview and widgets
 * Declare the public API stable

[Full history](https://github.com/kchapelier/ti-selector/blob/master/CHANGELOG.md)

## Roadmap

 * Check whether it can be made available in gittio.
 * Declare the API stable and hit 1.0.0 once all the above is done.
