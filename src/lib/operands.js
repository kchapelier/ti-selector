var operands = (function() {
    "use strict";

    var list = {
        'match-tag' : function(actual, expected) {
            actual = actual.substr(actual.lastIndexOf('.') + 1);

            return (actual.toLowerCase() === expected.toLowerCase());
        },
        '=' : function(actual, expected) {
            return (actual === expected);
        },
        '~=' : function(actual, expected) {
            //TODO what if the expected value is not simply alphabetical but a value like .* ?
            return ((new RegExp('(^| )' + expected + '($| )')).test(actual));
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

    var operands = function(operand, actual, expected) {
        var result = false,
            typeActual = typeof actual;

        if(
            (typeActual === 'string' || typeActual === 'number') &&
            list.hasOwnProperty(operand)
        ) {
            result = !!list[operand](String(actual), String(expected));
        }

        return result;
    };

    return operands;
}());

module.exports = operands;