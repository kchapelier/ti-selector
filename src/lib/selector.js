var parser = require('./query-parser'),
    iterator = require('./iterator');

var selector = (function() {
    "use strict";
    
    var getMatchingFunction = function(query) {
        var type = typeof query,
            matchingFunction;
        
        if(type === 'function') {
            matchingFunction = query;
        } else if(type === 'string') {
            var ruleSetList = parser(query);
            
            matchingFunction = function(element) {
                throw new Error('To implement');
            };
        } else {
            throw new Error('Unexpected type of query : ' + type);
        }
        
        return matchingFunction;
    };
    
    var getElements = function(root, query, limit) {
        throw new Error('To implement');
    };
    
    var getElement = function(root, query) {
        return getElements(root, query, 1);
    };
    
    var getParents = function(root, query, limit) {
        throw new Error('To implement');
    };
    
    var getParent = function(root, query) {
        return getParents(root, query, 1);
    };
    
    var selector = getElements;
    selector.getElements = getElements;
    selector.getElement = getElement;
    selector.getParents = getParents;
    selector.getParent = getParent;
    
    return selector;
}());

module.exports = selector;