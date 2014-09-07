# ti-selector

Simple selector for Titanium's native view elements.

## Intent

## Projected API

### selector.getElements(rootElement, query)

Returns an array with all the elements inside the root element matching the query.
Returns an empty array if no elements match the query.

#### Exemples

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

#### Exemples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get the first View element with an id equal to "panel"
var panel = $$.getElement(windowElement, 'view#panel');
```

### selector.getParents(rootElement, query)

Returns an array with all the parent elements of the root element matching the query.
Returns an empty array if no elements match the query.

#### Exemples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get all the parent View
var parentViews = $$.getParents(windowElement, 'view');
```

### selector.getParent(rootElement, query)

Returns the first parent element of the root element matching query.
Returns null if no elements match the query.

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get the first parent View
var parentView = $$.getParent(windowElement, 'view');
```

## Roadmap

 * Define the public API
 * Write mocha tests for the query parser
 * Implement the query parser
 * Implement the iterator
 * Implement the public API
 * Make a build script to concatenate the files to avoid the CommonJS/Alloy issues on Android
