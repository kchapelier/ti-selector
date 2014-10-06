var operands = (function() {
    "use strict";

    var list = {
        'match-tag' : function(actual, expected) {
            actual = actual.substr(actual.lastIndexOf('.') + 1);

            return actual.toLowerCase() === expected.toLowerCase();
        },
        '=' : function(actual, expected) {
            return actual === expected;
        },
        '~=' : function(actual, expected) {
            return (actual && (new RegExp('(^| )' + expected + '($| )')).test(actual));
        },
        '|=' : function(actual, expected) {
            //TODO to implement
        },
        '^=' : function(actual, expected) {
            return (actual && actual.indexOf && actual.indexOf(expected) === 0);
        },
        '$=' : function(actual, expected) {
            return (actual && actual.lastIndexOf && actual.lastIndexOf(expected) === actual.length - 1 - expected.length);
        },
        '*=' : function(actual, expected) {
            return (actual && actual.indexOf && actual.indexOf(expected) > -1);
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