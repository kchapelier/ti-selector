"use strict";

require('chai').should();

var parser = require('../src/lib/query-parser');

describe('parser', function() {
    it('should accept id selector', function() {
        var ruleSetList = parser('#some-id');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('id');
        ruleSetList[0][0].operand.should.equal('=');
        ruleSetList[0][0].value.should.equal('some-id');
    });

    it('should accept classname selector', function() {
        var ruleSetList = parser('.some-class');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('class');
        ruleSetList[0][0].operand.should.equal('~=');
        ruleSetList[0][0].value.should.equal('some-class');
    });

    it('should accept tagname selector', function() {
        var ruleSetList = parser('some-tag');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('tagname');
        ruleSetList[0][0].operand.should.equal('match-tag');
        ruleSetList[0][0].value.should.equal('some-tag');
    });

    it('should accept any combination of selector', function() {
        var ruleSetList = parser('some-tag.some-class#some-id');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(3);

        var ruleSetList = parser('.some-class.some-other-class');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(2);
    });

    it('should accept multiple queries separated by a comma', function() {
        var ruleSetList = parser('.some-class, .some-other-class, #some-id');

        ruleSetList.length.should.equal(3);
    });

    it('should ignore empty selector', function() {
        var ruleSetList = parser('');

        ruleSetList.length.should.equal(0);

        var ruleSetList = parser(',,,some-tag,,,');

        ruleSetList.length.should.equal(1);
    });

    it('should not accept queries with multiple levels', function() {
        (function() { parser('.some-class .some-other-class'); }).should.throw(/Unexpected character/);
        (function() { parser('.some-class>.some-other-class'); }).should.throw(/Unexpected character/);
        (function() { parser('.some-class+.some-other-class'); }).should.throw(/Unexpected character/);
    });
});
