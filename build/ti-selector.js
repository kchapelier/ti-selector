/**
 * ti-selector
 * 
 * Simple selector for Titanium's native view elements.
 * 
 * Author: Kevin Chapelier
 * Version: 0.3.0
 * License: MIT
 * Repository: https://github.com/kchapelier/ti-selector.git
 */

(function() {
    "use strict";

    var operators = (function() {
        var list = {
            'match-tag' : function(actual, expected) {
                actual = actual.substr(actual.lastIndexOf('.') + 1);

                return (actual.toLowerCase() === expected.toLowerCase());
            },
            '=' : function(actual, expected) {
                return (actual === expected);
            },
            '!=' : function(actual, expected) {
                return (actual !== expected);
            },
            '~=' : function(actual, expected) {
                return (' ' + actual +  ' ').indexOf(' ' + expected + ' ') > -1;
            },
            '|=' : function(actual, expected) {
                return (actual === expected) | (actual.indexOf(expected + '-') === 0);
            },
            '^=' : function(actual, expected) {
                return (actual.indexOf(expected) === 0);
            },
            '$=' : function(actual, expected) {
                return (actual.lastIndexOf(expected) === actual.length - expected.length);
            },
            '*=' : function(actual, expected) {
                return (actual.indexOf(expected) > -1);
            }
        };

        var operators = function(operator, actual, expected) {
            var result = false,
                typeActual = typeof actual;

            if(
                (typeActual === 'string' || typeActual === 'number') &&
                list.hasOwnProperty(operator)
            ) {
                result = !!list[operator](String(actual), String(expected));
            }

            return result;
        };

        return operators;
    }());



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

        var getSiblings = function(element) {
            var siblings = [],
                parent = getParents(element);

            if(parent.length) {
                siblings = getChildren(parent[0]);
            }

            return siblings.filter(function(siblingElement) {
                return siblingElement !== element;
            });
        };

        var createWalkFunction = function(baseFunction, iterative) {
            var self = function(root, func) {
                var elements = baseFunction(root);

                for(var i = 0; i < elements.length; i++) {
                    var element = elements[i];

                    if(false === func(element)) {
                        return;
                    }

                    if(iterative) {
                        self(element, func);
                    }
                }
            };

            return self;
        };

        return {
            walkParents  : createWalkFunction(getParents, true),
            walkChildren : createWalkFunction(getChildren, true),
            walkSiblings : createWalkFunction(getSiblings, false)
        };
    }());



    var parser = (function() {
        var tokenizer = function(query) {
            var position = 0,
                length = query.length,
                tokens = [];

            var allowedCharactersForId = 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890-_'.split(''),
                allowedCharactersForClassName = allowedCharactersForId,
                allowedCharactersForTagName = allowedCharactersForId,
                allowedCharactersForAttribute = allowedCharactersForId,
                allowedCharactersForoperator = '^$*|!='.split('');

            var readBasicToken = function(property, operator, allowedCharacters) {
                var token = { property : property, operator : operator, value : null },
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
                return readBasicToken('class', '~=', allowedCharactersForClassName);
            };

            // https://developer.mozilla.org/en-US/docs/Web/CSS/string

            var readQuotedString = function() {
                var quote = query[position],
                    result = '',
                    escaped = false,
                    escapedToken = '';

                while(position < length) {
                    position++;

                    var character = query[position];

                    if(escaped) {
                        if(false) {
                            //TODO treat hexadecimal token here
                            //http://www.w3.org/TR/2013/WD-css-syntax-3-20131105/#consume-an-escaped-code-point0
                        } else {
                            result+= character;
                            escaped = false;
                        }
                    } else {
                        if(character === quote) {
                            break;
                        } else if(character === '\\') {
                            escaped = true;
                        } else {
                            result+= character;
                        }
                    }

                }

                return result;
            };

            var readAttributeSelector = function() {
                var property = '',
                    operator = '',
                    value = '',
                    step = 0, //0 : property, 1 : operator, 2 : value
                    end = false;

                while(position < length && !end) {
                    var character = query[position];

                    if(character === ']') {
                        end = true;
                        position--;
                    } else {
                        if(step === 0) {
                            if(allowedCharactersForAttribute.indexOf(character) >= 0) {
                                property+= character;
                            } else {
                                step++;
                            }
                        }

                        if(step === 1) {
                            if(allowedCharactersForoperator.indexOf(character) >= 0) {
                                operator+= character;
                            } else {
                                step++;
                            }
                        }

                        if(step === 2) {
                            if(character === '\'' || character === '"') {
                                value = readQuotedString(character);
                            } else {
                                value+= character;
                            }
                        }
                    }

                    position++;
                }

                return {
                    property : property,
                    operator : operator,
                    value : value
                };
            };

            while(position < length) {
                var character = query[position];

                if(character === '[') {
                    position = position + 1;
                    tokens.push(readAttributeSelector());
                } else if(character === '.') {
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
                                operator = ruleSet[j].operator;

                            if(property === 'class') {
                                property = 'className';
                            } else if(property === 'tagname') {
                                property = 'apiName';
                            }

                            matching = operators(operator, element[property], value);
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
}());