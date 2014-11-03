/* Submodules */

var parser = require('./query-parser'),
    iterator = require('./iterator'),
    operators = require('./operators');

/* Submodules end */

var selector = (function () {
    "use strict";

    var getMatchingFunction = function (query) {
        var type = typeof query,
            matchingFunction;

        if (type === 'function') {
            matchingFunction = query;
        } else if (type === 'string') {
            var ruleSetList = parser(query);

            matchingFunction = function (element) {
                for (var i = 0; i < ruleSetList.length; i++) {
                    var ruleSet = ruleSetList[i];

                    var matching = true;

                    for (var j = 0; j < ruleSet.length && matching; j++) {
                        var property = ruleSet[j].property,
                            value = ruleSet[j].value,
                            operator = ruleSet[j].operator;

                        if (property === 'class') {
                            property = 'className';
                        } else if (property === 'tagname') {
                            property = 'apiName';
                        }

                        matching = operators(operator, element[property], value);
                    }

                    if (matching) {
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

    var createGetFunction = function (walkingFunction, limit) {
        return function (root, query) {
            var queryFunction = getMatchingFunction(query),
                results = [];

            walkingFunction(root, function (element) {
                if (queryFunction(element)) {
                    results.push(element);
                }

                if (limit && results.length >= limit) {
                    return false;
                }
            });

            return limit === 1 ? results[0] : results;
        };
    };

    var getElements = createGetFunction(iterator.walkChildren, null),
        getElement = createGetFunction(iterator.walkChildren, 1),
        getParents = createGetFunction(iterator.walkParents, null),
        getParent = createGetFunction(iterator.walkParents, 1),
        getSiblings = createGetFunction(iterator.walkSiblings, null),
        getSibling = createGetFunction(iterator.walkSiblings, 1);

    var selector = getElements;
    selector.getElements = getElements;
    selector.getElement = getElement;
    selector.getParents = getParents;
    selector.getParent = getParent;
    selector.getSiblings = getSiblings;
    selector.getSibling = getSibling;

    return selector;
}());

module.exports = selector;
