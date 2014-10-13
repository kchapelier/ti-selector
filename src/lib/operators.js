var operators = (function() {
    "use strict";

    //From http://stackoverflow.com/a/6969486
    var escapeRegexpString = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    var list = {
        'match-tag' : function(actual, expected) {
            actual = actual.substr(actual.lastIndexOf('.') + 1);

            return (actual.toLowerCase() === expected.toLowerCase());
        },
        '=' : function(actual, expected) {
            return (actual === expected);
        },
        '~=' : function(actual, expected) {
            return ((new RegExp('(^| )' + escapeRegexpString(expected) + '($| )')).test(actual));
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