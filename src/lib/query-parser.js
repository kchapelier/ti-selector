var parser = (function() {
    "use strict";
    
    var tokenizer = function(query) {
        throw new Error('To implement');
        
        var position = 0,
            length = query.length,
            tokens = [];
        
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
            return readBasicToken(
                'tagname',
                '=',
                'a-zA-Z0-9-_'.join('')
            );
        };
        
        var readId = function() {
            return readBasicToken(
                'id',
                '=',
                'a-zA-Z0-9-_'.join('')
            );
        };
        
        var readClassName = function() {
            return readBasicToken(
                'classname',
                '=',
                'a-zA-Z0-9-_'.join('')
            );
        };
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