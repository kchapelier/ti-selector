var parser = (function() {
    "use strict";

    var tokenizer = function(query) {
        var position = 0,
            length = query.length,
            tokens = [];

        var allowedCharactersForId = 'azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN1234567890-_'.split(''),
            allowedCharactersForClassName = allowedCharactersForId,
            allowedCharactersForTagName = allowedCharactersForId,
            allowedCharactersForAttribute = allowedCharactersForId,
            allowedCharactersForoperator = '^$*|!='.split(''),
            hexadecimalCharacters = 'ABCDEFabcdef0123456789'.split('');

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
                escapedToken;

            while(position < length) {
                position++;

                var character = query[position];

                if(escaped) {
                    if(hexadecimalCharacters.indexOf(character) > -1 && escapedToken.length < 6) {
                        escapedToken+= character;
                    } else {
                        if(escapedToken) {
                            var characterCode = parseInt(escapedToken.toString(), 16);
                            result+= String.fromCharCode(characterCode);
                            position--;
                        } else {
                            result+= character;
                        }

                        escaped = false;
                    }
                } else {
                    if(character === quote) {
                        break;
                    } else if(character === '\\') {
                        escaped = true;
                        escapedToken = '';
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

module.exports = parser;