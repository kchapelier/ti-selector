var parser = (function () {
    "use strict";

    var tokenizer = function (query) {
        var position = 0,
            length = query.length,
            tokens = [];

        var allowedCharactersForId = 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890-_'.split(''),
            allowedCharactersForClassName = allowedCharactersForId,
            allowedCharactersForTagName = allowedCharactersForId,
            allowedCharactersForAttribute = allowedCharactersForId,
            allowedCharactersForoperator = '^$*|!='.split(''),
            hexadecimalCharacters = 'ABCDEFabcdef0123456789'.split('');

        var readBasicSelector = function (property, operator, allowedCharacters) {
            var value = '',
                character;

            while (position < length) {
                character = query[position];

                if (allowedCharacters.indexOf(character) >= 0) {
                    value += character;
                    position++;
                } else {
                    position--;
                    break;
                }
            }

            return {
                property: property,
                operator: operator,
                value: value
            };
        };

        var readTagName = function () {
            return readBasicSelector('tagname', 'match-tag', allowedCharactersForTagName);
        };

        var readId = function () {
            return readBasicSelector('id', '=', allowedCharactersForId);
        };

        var readClassName = function () {
            return readBasicSelector('class', '~=', allowedCharactersForClassName);
        };

        var readQuotedString = function () {
            var quote = query[position],
                result = '',
                escaped = false,
                escapedToken,
                character,
                characterCode;

            while (position < length) {
                position++;

                character = query[position];

                if (escaped) {
                    if (hexadecimalCharacters.indexOf(character) > -1 && escapedToken.length < 6) {
                        escapedToken += character;
                    } else {
                        if (escapedToken) {
                            characterCode = parseInt(escapedToken.toString(), 16);
                            result += String.fromCharCode(characterCode);
                            position--;
                        } else {
                            result += character;
                        }

                        escaped = false;
                    }
                } else {
                    if (character === quote) {
                        break;
                    } else if (character === '\\') {
                        escaped = true;
                        escapedToken = '';
                    } else {
                        result += character;
                    }
                }
            }

            return result;
        };

        var readAttributeSelector = function () {
            var property = '',
                operator = '',
                value = '',
                step = 0, //0 : property, 1 : operator, 2 : value
                character;

            while (position < length) {
                character = query[position];

                if (character === ']') {
                    break;
                }

                if (step === 0) {
                    if (allowedCharactersForAttribute.indexOf(character) >= 0) {
                        property += character;
                    } else {
                        step++;
                    }
                }

                if (step === 1) {
                    if (allowedCharactersForoperator.indexOf(character) >= 0) {
                        operator += character;
                    } else {
                        step++;
                    }
                }

                if (step === 2) {
                    if (character === '\'' || character === '"') {
                        value = readQuotedString(character);
                    } else {
                        value += character;
                    }
                }

                position++;
            }

            return {
                property: property,
                operator: operator ? operator : 'has',
                value: value
            };
        };

        while (position < length) {
            var character = query[position];

            if (character === '[') {
                position = position + 1;
                tokens.push(readAttributeSelector());
            } else if (character === '.') {
                position = position + 1;
                tokens.push(readClassName());
            } else if (character === '#') {
                position = position + 1;
                tokens.push(readId());
            } else if (!tokens.length && allowedCharactersForTagName.indexOf(character) >= 0) {
                tokens.push(readTagName());
            } else if (!tokens.length && character === '*') {
                tokens.push({
                    property: 'tagname',
                    operator: '*',
                    value: ''
                });
            } else {
                throw new Error('Unexpected character : "' + character + '"');
            }

            position++;
        }

        return tokens;
    };

    var parser = function (query) {
        var ruleSetList = [],
            individualQueries = query.split(',');

        individualQueries.forEach(function (individualQuery) {
            individualQuery = individualQuery.trim();
            var ruleSet = tokenizer(individualQuery);
            if (ruleSet.length > 0) {
                ruleSetList.push(ruleSet);
            }
        });

        return ruleSetList;
    };

    return parser;
}());

module.exports = parser;
