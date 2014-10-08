"use strict";

require('chai').should();

var operands = require('../src/lib/operands');

describe('operand match-tag', function() {
    it('should be true if the last element of the dot-separated actual value is the expected value', function() {
        operands('match-tag', 'Ti.UI.View', 'View').should.be.true;
        operands('match-tag', 'View', 'View').should.be.true;
    });

    it('should be false if the last element of the dot-separated actual value isnt the expected value', function() {
        operands('match-tag', 'Ti.UI.ImageView', 'View').should.be.false;
        operands('match-tag', 'Ti.UI.View.Something', 'View').should.be.false;
        operands('match-tag', 'ImageView', 'View').should.be.false;
    });

    it('should be case insensitive', function() {
        operands('match-tag', 'Ti.UI.View', 'view').should.be.true;
    });
});

describe('operand =', function() {
    it('should be true if the values are equals', function() {
        operands('=', 'machin 1', 'machin 1').should.be.true;
        operands('=', 1, 1).should.be.true;
        operands('=', '1', 1).should.be.true;
    });

    it('should be false if the values are not equals', function() {
        operands('=', 'machin 1', 'machin 2').should.be.false;
        operands('=', 1, 2).should.be.false;
        operands('=', '1 thing', 1).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operands('=', '0', '0').should.be.true;
        operands('=', 0, 0).should.be.true;
        operands('=', '', '').should.be.true;
    });
});

describe('operand ~=', function() {
    it('should be true if the expected value is contained as a word', function() {
        operands('~=', 'machin 1', 'machin').should.be.true;
        operands('~=', '1 machin', 'machin').should.be.true;
        operands('~=', '1 machin 1', 'machin').should.be.true;
        operands('~=', 1, 1).should.be.true;
        operands('~=', '1', 1).should.be.true;
    });

    it('should be true if the expected value is not contained as a word', function() {
        operands('~=', 'machin 1', 'chose').should.be.false;
        operands('~=', 'une-chose', 'chose').should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operands('~=', '0', '0').should.be.true;
        operands('~=', 0, 0).should.be.true;
        operands('~=', '', '').should.be.true;
    });

    it('should work with special character (which would normally clash with the regexp)', function() {
        operands('~=', '\\(//)+', '\\(//)+').should.be.true;
        operands('~=', '.', '.*').should.be.false;
    });
});

describe('operand |=', function() {
    it('should be true if the values are equals', function() {
        operands('|=', 'machin', 'machin').should.be.true;
        operands('|=', 1, 1).should.be.true;
        operands('|=', '1', 1).should.be.true;
    });

    it('should be true if the actual value starts with the expected value followed by a dash', function() {
        operands('|=', 'machin-chose', 'machin').should.be.true;
        operands('|=', '1-2', 1).should.be.true;
    });

    it('should be false if the values are not equal and the actual value doesnt starts with the expected value followed by a dash', function() {
        operands('|=', 'chose', 'machin').should.be.false;
        operands('|=', 'chose-machin', 'machin').should.be.false;
        operands('|=', 'chose-machin-something', 'machin').should.be.false;
        operands('|=', 2, 1).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operands('|=', '0', '0').should.be.true;
        operands('|=', 0, 0).should.be.true;
        operands('|=', '', '').should.be.true;
    });
});

describe('operand ^=', function() {
    it('should be true if the actual value starts with the expected value', function() {
        operands('^=', 'machin 1', 'machin').should.be.true;
        operands('^=', 'machine', 'machin').should.be.true;
        operands('^=', 1, 1).should.be.true;
    });

    it('should be false if the actual value doesnt start with the expected value', function() {
        operands('^=', 'machin 1', 'chose').should.be.false;
        operands('^=', 'une chose', 'chose').should.be.false;
        operands('^=', 1, 2).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operands('^=', '0', '0').should.be.true;
        operands('^=', 0, 0).should.be.true;
        operands('^=', '', '').should.be.true;
    });
});

describe('operand $=', function() {
    it('should be true if the actual value ends with the expected value', function() {
        operands('$=', '1 machin', 'machin').should.be.true;
        operands('$=', 'emachin', 'machin').should.be.true;
        operands('$=', 1, 1).should.be.true;
    });

    it('should be false if the actual value doesnt end with the expected value', function() {
        operands('$=', 'machin 1', 'chose').should.be.false;
        operands('$=', 'chose une', 'chose').should.be.false;
        operands('$=', 1, 2).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operands('$=', '0', '0').should.be.true;
        operands('$=', 0, 0).should.be.true;
        operands('$=', '', '').should.be.true;
    });
});

describe('operand *=', function() {
    it('should be true if the expected value is contained in the actual value', function() {
        operands('*=', 'machin', 'machin').should.be.true;
        operands('*=', '1 machin', 'machin').should.be.true;
        operands('*=', 'machine', 'machin').should.be.true;
        operands('*=', 1, 1).should.be.true;
        operands('*=', '0123', 1).should.be.true;
    });

    it('should be false if the expected value is not contained in the actual value', function() {
        operands('*=', 'chose', 'machin').should.be.false;
        operands('*=', 'machi', 'machin').should.be.false;
        operands('*=', 1, 2).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operands('*=', '0', '0').should.be.true;
        operands('*=', 0, 0).should.be.true;
        operands('*=', '', '').should.be.true;
    });
});