var parser = require('./query-parser'),
    iterator = require('./iterator');

var selector = (function() {
    "use strict";
    
    var operands = {
        'match-class' : function(actual, expected) {
            return (actual && (new RegExp('(^| )' + expected + '($| )')).test(actual));
        },
        'match-tag' : function(actual, expected) {
            actual = actual.substr(actual.lastIndexOf('.') + 1);
            
            return actual.toLowerCase() == expected.toLowerCase();
        },
        '=' : function(actual, expected) {
            return actual === expected;
        }
    };
    
    var getMatchingFunction = function(query) {
        var type = typeof query,
            matchingFunction;
        
        if(type === 'function') {
            matchingFunction = query;
        } else if(type === 'string') {
            var ruleSetList = parser(query);
            
            matchingFunction = function(element) {
                for(var i = 0; i < ruleSetList.length; i++) {
                    var ruleSet = ruleSetList[i];
                    
                    var matching = true;
                    
                    for(var j = 0; j < ruleSet.length && matching; j++) {
                        var property = ruleSet[j].property,
                            value = ruleSet[j].value,
                            operand = ruleSet[j].operand; //willfully ignored so far
                        
                        if(property === 'class') {
                            property = 'className';
                        } else if(property === 'tagname') {
                            property = 'apiName';
                        }
                        
                        matching = operands[operand] && element[property] && operands[operand](element[property], value);
                    }
                    
                    if(matching) {
                        return true;
                    }
                }
                
                return false;
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