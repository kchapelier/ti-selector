var operators = (function() {
    "use strict";

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

module.exports = operators;