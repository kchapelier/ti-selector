"use strict";

require('chai').should();

var parser = require('../src/lib/query-parser');

describe('parser', function() {
    it('should accept id selector', function() {
        var ruleSetList = parser('#some-id');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('id');
        ruleSetList[0][0].operator.should.equal('=');
        ruleSetList[0][0].value.should.equal('some-id');
    });

    it('should accept classname selector', function() {
        var ruleSetList = parser('.some-class');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('class');
        ruleSetList[0][0].operator.should.equal('~=');
        ruleSetList[0][0].value.should.equal('some-class');
    });

    it('should accept tagname selector', function() {
        var ruleSetList = parser('some-tag');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('tagname');
        ruleSetList[0][0].operator.should.equal('match-tag');
        ruleSetList[0][0].value.should.equal('some-tag');
    });

    it('should accept attribute selector', function() {
        var ruleSetList = parser('[property^=test]');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('property');
        ruleSetList[0][0].operator.should.equal('^=');
        ruleSetList[0][0].value.should.equal('test');
    });

    it('should accept "has" attribute selector', function() {
        var ruleSetList = parser('[property]');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('property');
        ruleSetList[0][0].operator.should.equal('has');
    });

    it('should accept attribute selector with quoted value', function() {
        var ruleSetList = parser('[property="[some value!]"]');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(1);

        ruleSetList[0][0].property.should.equal('property');
        ruleSetList[0][0].operator.should.equal('=');
        ruleSetList[0][0].value.should.equal('[some value!]');
    });

    it('should accept attribute selector with quoted value and escaped characters', function() {
        var ruleSetList = parser('[property="\\""]');
        ruleSetList[0][0].value.should.equal('"');

        var ruleSetList = parser("[property='\\'']");
        ruleSetList[0][0].value.should.equal("'");

        var ruleSetList = parser('[property="\\\\"]');
        ruleSetList[0][0].value.should.equal('\\');

        var ruleSetList = parser('[property="r\\st"]');
        ruleSetList[0][0].value.should.equal('rst');
    });

    it('should accept attribute selector with quoted value and escaped hexadecimal token', function() {
        var ruleSetList = parser('[property="\\A"]');
        ruleSetList[0][0].value.should.equal('\n');

        var ruleSetList = parser('[property="\\00000aa"]');
        ruleSetList[0][0].value.should.equal('\na');

        var ruleSetList = parser('[property="\\3042"]');
        ruleSetList[0][0].value.should.equal('あ');
    });

    it('should accept any combination of selector', function() {
        var ruleSetList = parser('some-tag.some-class#some-id');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(3);

        ruleSetList = parser('.some-class.some-other-class');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(2);

        ruleSetList = parser('view[property=some value][property2="some other value"]');

        ruleSetList.length.should.equal(1);
        ruleSetList[0].length.should.equal(3);
    });

    it('should accept multiple queries separated by a comma', function() {
        var ruleSetList = parser('.some-class, .some-other-class, #some-id');

        ruleSetList.length.should.equal(3);
    });

    it('should ignore empty selector', function() {
        var ruleSetList = parser('');

        ruleSetList.length.should.equal(0);

        ruleSetList = parser(',,,some-tag,,,');

        ruleSetList.length.should.equal(1);
    });

    it('should not accept queries with multiple levels', function() {
        (function() { parser('.some-class .some-other-class'); }).should.throw(/Unexpected character/);
        (function() { parser('.some-class>.some-other-class'); }).should.throw(/Unexpected character/);
        (function() { parser('.some-class+.some-other-class'); }).should.throw(/Unexpected character/);
    });
});
