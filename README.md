# ti-selector

Simple selector for Titanium's native view elements.

## Intent

Provide a way to easily retrieve specific elements from the Titanium views.

The library will be limited to an intentionally limited subset of the css selector syntax.

## Public API

### selector.getElements(rootElement, query)

Returns an array with all the elements inside the root element matching the query.
Returns an empty array if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get all the ImageView elements in the window
var imageViews = $$.getElements(windowElement, 'imageview');

// Get all the Button elements with a className attribute containing "right-button"
var rightButton = $$.getElements(windowElement, 'button.right-button');

// Get all the View elements with an id equal to "panel"
// Note : in Titanium, multiple elements can have the same id in some circumstances
var panels = $$.getElements(windowElement, 'view#panel');
```

#### Shortcut

For the sake of conciseness, selector is itself a reference to the getElements function.

```js
var $$ = require('selector'),
    windowElement = $.window;

var imageViews = $$(windowElement, 'imageview');
var rightButton = $$(windowElement, 'button.right-button');
var panels = $$(windowElement, 'view#panel');
```

### selector.getElement(rootElement, query)

Returns the first element found inside the root element matching the query.
Returns null if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get the first View element with an id equal to "panel"
var panel = $$.getElement(windowElement, 'view#panel');
```

### selector.getParents(rootElement, query)

Returns an array with all the parent elements of the root element matching the query.
Returns an empty array if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get all the parent View
var parentViews = $$.getParents(windowElement, 'view');
```

### selector.getParent(rootElement, query)

Returns the first parent element of the root element matching query.
Returns null if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get the first parent View
var parentView = $$.getParent(windowElement, 'view');
```

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

## Changelog

### 0.2.0 (2014.10.08) :

 * Add basic support for attributes selectors
 * Support all operators (=, ~=, |=, ^=, $= and *=), except the lack of operator

### 0.1.0 (2014.10.03) :

 * First implementation

[Full history](https://github.com/kchapelier/ti-selector/blob/master/CHANGELOG.md)

## Roadmap

 * Add support for *[attribute=value]* selectors.
 * Try to add proper support for listview, tableview and widget if possible.
 * Write better doc.
 * Check whether it can be used in vanilla Titanium (outside of Alloy).
 * Check whether it can be made available in gittio.
 * Declare the API stable and hit 1.0.0 once all the above is done.
