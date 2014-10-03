(function() {
    "use strict";

    var iterator = (function() {
        var getChildren = function(element) {
            var children = [];

            if(element.children) {
                children = element.children;
            } else if(element.apiName === 'Ti.UI.TableView') {
                if(element.sections) {
                    children = element.sections;
                } else {
                    children = element.data;
                }
            } else if(element.apiName === 'Ti.UI.TableViewSection') {
                children = element.rows;
            } else if(element.apiName === 'Ti.UI.TableViewRow') {
                children = element.data;
            }

            return children;
        };

        var getParents = function(element) {
            var parents = [];

            if(element.parent) {
                parents.push(element.parent);
            }

            return parents;
        };

        var createWalkFunction = function(iterativeFunc) {
            var self = function(root, func) {
                var elements = iterativeFunc(root);

                for(var i = 0; i < elements.length; i++) {
                    var element = elements[i];

                    if(false === func(element)) {
                        return;
                    }

                    self(element, func);
                }
            };

            return self;
        };

        return {
            walkParents : createWalkFunction(getParents),
            walkChildren : createWalkFunction(getChildren)
        };
    }());



    var parser = (function() {
        var tokenizer = function(query) {
            var position = 0,
                length = query.length,
                tokens = [];

            var allowedCharactersForId = 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890-_'.split(''),
                allowedCharactersForClassName = allowedCharactersForId,
                allowedCharactersForTagName = allowedCharactersForId;

            var readBasicToken = function(property, operand, allowedCharacters) {
                var token = { property : property, operand : operand, value : null },
                    value = '',
                    end = false;

                while(position < length && !end) {
                    var character = query[position];

                    if(allowedCharacters.indexOf(character) >= 0) {
                        value+= character;
                        position++;
                    } else {
                        end = true;
                        position--;
                    }
                }

                token.value = value;

                return token;
            };

            var readTagName = function() {
                return readBasicToken('tagname', 'match-tag', allowedCharactersForTagName);
            };

            var readId = function() {
                return readBasicToken('id', '=', allowedCharactersForId);
            };

            var readClassName = function() {
                return readBasicToken('class', 'match-class', allowedCharactersForClassName);
            };

            while(position < length) {
                var character = query[position];

                if(character === '.') {
                    position = position + 1;
                    tokens.push(readClassName());
                } else if(character === '#') {
                    position = position + 1;
                    tokens.push(readId());
                } else if(allowedCharactersForTagName.indexOf(character) >= 0) {
                    tokens.push(readTagName());
                } else {
                    throw new Error('Unexpected character : "' + character + '"');
                }

                position++;
            }

            return tokens;
        };

        var parser = function(query) {
            var ruleSetList = [],
                individualQueries = query.split(',');

            individualQueries.forEach(function(individualQuery) {
                individualQuery = individualQuery.trim();
                var ruleSet = tokenizer(individualQuery);
                if(ruleSet.length > 0) {
                    ruleSetList.push(ruleSet);
                }
            });

            return ruleSetList;
        };

        return parser;
    }());



    var selector = (function() {
        var operands = {
            'match-class' : function(actual, expected) {
                return (actual && (new RegExp('(^| )' + expected + '($| )')).test(actual));
            },
            'match-tag' : function(actual, expected) {
                actual = actual.substr(actual.lastIndexOf('.') + 1);

                return actual.toLowerCase() === expected.toLowerCase();
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

        var createGetFunction = function(walkingFunction, limit) {
            return function(root, query) {
                var queryFunction = getMatchingFunction(query),
                    results = [];

                walkingFunction(root, function(element) {
                    if(queryFunction(element)) {
                        results.push(element);
                    }

                    if(limit && results.length >= limit) {
                        return false;
                    }
                });

                return limit === 1 ? results[0] : results;
            };
        };

        var getElements = createGetFunction(iterator.walkChildren, null),
            getElement = createGetFunction(iterator.walkChildren, 1),
            getParents = createGetFunction(iterator.walkParents, null),
            getParent = createGetFunction(iterator.walkParents, 1);

        var selector = getElements;
        selector.getElements = getElements;
        selector.getElement = getElement;
        selector.getParents = getParents;
        selector.getParent = getParent;

        return selector;
    }());




    module.exports = selector;
}());