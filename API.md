# ti-selector - Public API

## Methods

### selector.getElements(element, query)

Returns an array with all the elements inside the given element matching the query.
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

### selector.getElement(element, query)

Returns the first element found inside the given element matching the query.
Returns null if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get the first View element with an id equal to "panel"
var panel = $$.getElement(windowElement, 'view#panel');
```

### selector.getParents(element, query)

Returns an array with all the parent elements of the given element matching the query.
Returns an empty array if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get all the parent View
var parentViews = $$.getParents(windowElement, 'view');
```

### selector.getParent(element, query)

Returns the first parent element of the given element matching query.
Returns null if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    windowElement = $.window;

// Get the first parent View
var parentView = $$.getParent(windowElement, 'view');
```

### selector.getSiblings(element, query)

Returns an array with all the siblings of the given element matching the query.
Returns an empty array if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    eventList = $.eventList;

// Get all the sibling View
var siblingViews = $$.getSiblings(eventList, 'view');
```

### selector.getSibling(element, query)

Returns the first sibling of the given element matching the query.
Returns null if no elements match the query.

#### Examples

```js
var $$ = require('selector'),
    eventList = $.eventList;

// Get the first sibling View
var siblingView = $$.getSibling(eventList, 'view');
```

## Query

### "CSS" Selectors

If the query is a string, it will be interpreted as a [CSS selector](http://www.w3.org/TR/css3-selectors/#selectors).

The library has its own CSS selector parser

[X] Type selectors
[X] Id selectors
[X] Class selector
[X] Attribute selectors (with the addition of the non-standard !=)
[ ] Universal selector (*)
[ ] Pseudo classes
[ ] Combinators (*not planned* as it would negatively impact performances)

#### Summary

 * view : An type selector, will match elements based on their type, here Ti.UI.View.
 * .className : A class selector, will match elements based on their className property (not class as this property is stripped out by Alloy).
 * #id : An id selector, will match elements based on their id property
 * [property=value] : An attribute selector, will match element based on their properties (the implementation match the CSS3 specification

#### Examples

 * view, label : Any Ti.UI.View and Ti.UI.Label elements.
 * view.myclass : Any Ti.UI.View elements with the className property containing the word myclass.
 * #specificid : Any elements with the id property equal to specificid.
 * label[text^="Warning :"] : Any Ti.UI.Label element with a text property starting with "Warning :".
 * .warning[level!=3] : Any elements with a level attribute other than "3".
 * label:first-child : Will throw an error as pseudo elements are not implemented.
 * view label : Will throw an error as combinators are not implemented.

### Filter function

For more specific use cases, it's also possible to pass a filter function.

#### Example

```js
// Get the elements within the window whose text attribute is not a number
$$.getElements($.window, function(element) {
    return isNaN(element.text);
});
```

