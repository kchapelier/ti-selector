var parser = require('./query-parser'),
    iterator = require('./iterator');

var selector = (function() {
    "use strict";
    
    var getElements = function(root, query) {
        throw new Error('To implement');
    };
    
    var getElement = function(root, query) {
        throw new Error('To implement');
    };
    
    var getParents = function(root, query) {
        throw new Error('To implement');
    };
    
    var getParent = function(root, query) {
        throw new Error('To implement');
    };
    
    var selector = getElements;
    selector.getElements = getElements;
    selector.getElement = getElement;
    selector.getParents = getParents;
    selector.getParent = getParent;
    
    return selector;
}());

module.exports = selector;