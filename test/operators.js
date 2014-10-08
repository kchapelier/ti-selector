"use strict";

require('chai').should();

var operators = require('../src/lib/operators');

describe('operator match-tag', function() {
    it('should be true if the last element of the dot-separated actual value is the expected value', function() {
        operators('match-tag', 'Ti.UI.View', 'View').should.be.true;
        operators('match-tag', 'View', 'View').should.be.true;
    });

    it('should be false if the last element of the dot-separated actual value isnt the expected value', function() {
        operators('match-tag', 'Ti.UI.ImageView', 'View').should.be.false;
        operators('match-tag', 'Ti.UI.View.Something', 'View').should.be.false;
        operators('match-tag', 'ImageView', 'View').should.be.false;
    });

    it('should be case insensitive', function() {
        operators('match-tag', 'Ti.UI.View', 'view').should.be.true;
    });
});

describe('operator =', function() {
    it('should be true if the values are equals', function() {
        operators('=', 'machin 1', 'machin 1').should.be.true;
        operators('=', 1, 1).should.be.true;
        operators('=', '1', 1).should.be.true;
    });

    it('should be false if the values are not equals', function() {
        operators('=', 'machin 1', 'machin 2').should.be.false;
        operators('=', 1, 2).should.be.false;
        operators('=', '1 thing', 1).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operators('=', '0', '0').should.be.true;
        operators('=', 0, 0).should.be.true;
        operators('=', '', '').should.be.true;
    });
});

describe('operator ~=', function() {
    it('should be true if the expected value is contained as a word', function() {
        operators('~=', 'machin 1', 'machin').should.be.true;
        operators('~=', '1 machin', 'machin').should.be.true;
        operators('~=', '1 machin 1', 'machin').should.be.true;
        operators('~=', 1, 1).should.be.true;
        operators('~=', '1', 1).should.be.true;
    });

    it('should be true if the expected value is not contained as a word', function() {
        operators('~=', 'machin 1', 'chose').should.be.false;
        operators('~=', 'une-chose', 'chose').should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operators('~=', '0', '0').should.be.true;
        operators('~=', 0, 0).should.be.true;
        operators('~=', '', '').should.be.true;
    });

    it('should work with special character (which would normally clash with the regexp)', function() {
        operators('~=', '\\(//)+', '\\(//)+').should.be.true;
        operators('~=', '.', '.*').should.be.false;
    });
});

describe('operator |=', function() {
    it('should be true if the values are equals', function() {
        operators('|=', 'machin', 'machin').should.be.true;
        operators('|=', 1, 1).should.be.true;
        operators('|=', '1', 1).should.be.true;
    });

    it('should be true if the actual value starts with the expected value followed by a dash', function() {
        operators('|=', 'machin-chose', 'machin').should.be.true;
        operators('|=', '1-2', 1).should.be.true;
    });

    it('should be false if the values are not equal and the actual value doesnt starts with the expected value followed by a dash', function() {
        operators('|=', 'chose', 'machin').should.be.false;
        operators('|=', 'chose-machin', 'machin').should.be.false;
        operators('|=', 'chose-machin-something', 'machin').should.be.false;
        operators('|=', 2, 1).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operators('|=', '0', '0').should.be.true;
        operators('|=', 0, 0).should.be.true;
        operators('|=', '', '').should.be.true;
    });
});

describe('operator ^=', function() {
    it('should be true if the actual value starts with the expected value', function() {
        operators('^=', 'machin 1', 'machin').should.be.true;
        operators('^=', 'machine', 'machin').should.be.true;
        operators('^=', 1, 1).should.be.true;
    });

    it('should be false if the actual value doesnt start with the expected value', function() {
        operators('^=', 'machin 1', 'chose').should.be.false;
        operators('^=', 'une chose', 'chose').should.be.false;
        operators('^=', 1, 2).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operators('^=', '0', '0').should.be.true;
        operators('^=', 0, 0).should.be.true;
        operators('^=', '', '').should.be.true;
    });
});

describe('operator $=', function() {
    it('should be true if the actual value ends with the expected value', function() {
        operators('$=', '1 machin', 'machin').should.be.true;
        operators('$=', 'emachin', 'machin').should.be.true;
        operators('$=', 1, 1).should.be.true;
    });

    it('should be false if the actual value doesnt end with the expected value', function() {
        operators('$=', 'machin 1', 'chose').should.be.false;
        operators('$=', 'chose une', 'chose').should.be.false;
        operators('$=', 1, 2).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operators('$=', '0', '0').should.be.true;
        operators('$=', 0, 0).should.be.true;
        operators('$=', '', '').should.be.true;
    });
});

describe('operator *=', function() {
    it('should be true if the expected value is contained in the actual value', function() {
        operators('*=', 'machin', 'machin').should.be.true;
        operators('*=', '1 machin', 'machin').should.be.true;
        operators('*=', 'machine', 'machin').should.be.true;
        operators('*=', 1, 1).should.be.true;
        operators('*=', '0123', 1).should.be.true;
    });

    it('should be false if the expected value is not contained in the actual value', function() {
        operators('*=', 'chose', 'machin').should.be.false;
        operators('*=', 'machi', 'machin').should.be.false;
        operators('*=', 1, 2).should.be.false;
    });

    it('should work with 0 and empty values', function() {
        operators('*=', '0', '0').should.be.true;
        operators('*=', 0, 0).should.be.true;
        operators('*=', '', '').should.be.true;
    });
});