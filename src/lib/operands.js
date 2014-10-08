var operands = (function() {
    "use strict";

    var list = {
        'match-tag' : function(actual, expected) {
            actual = actual.substr(actual.lastIndexOf('.') + 1);

            return (actual.toLowerCase() === expected.toLowerCase());
        },
        '=' : function(actual, expected) {
            return (actual == expected);
        },
        '~=' : function(actual, expected) {
            //TODO what if the expected value is not simply alphabetical but a value like .* ?
            return ((new RegExp('(^| )' + expected + '($| )')).test(actual));
        },
        '|=' : function(actual, expected) {
            return (actual == expected) | (String(actual).indexOf(String(expected) + '-') === 0);
        },
        '^=' : function(actual, expected) {
            return (String(actual).indexOf(expected) === 0);
        },
        '$=' : function(actual, expected) {
            //TODO optimize this
            return (String(actual).lastIndexOf(expected) === String(actual).length - String(expected).length);
        },
        '*=' : function(actual, expected) {
            return (String(actual).indexOf(expected) > -1);
        }
    };

    var operands = function(operand, actual, expected) {
        var result = false;

        if(actual && list.hasOwnProperty(operand)) {
            result = !!list[operand](actual, expected);
        }

        return result;
    };

    return operands;
}());

module.exports = operands;