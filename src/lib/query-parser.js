var parser = (function() {
    "use strict";

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
            return readBasicToken('tagname', '=', allowedCharactersForTagName);
        };

        var readId = function() {
            return readBasicToken('id', '=', allowedCharactersForId);
        };

        var readClassName = function() {
            return readBasicToken('class', '=', allowedCharactersForClassName);
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

module.exports = parser;