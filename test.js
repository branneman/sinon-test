var sinon = require('sinon');
var should = require('chai').should();

describe('mock in require\'s modules', function() {
    beforeEach(function(){
        [
            './a',
            './aa',
            './aaa',
            './b',
            './ba'
        ].forEach(function(module){
            delete require.cache[require.resolve(module)];
        });
    });
    it('a(1) is a(1)', function() {
        var a = require('./a');
        a(1).should.equal('a(1)');
    });
    it('b(1) is b(1): a(1)', function() {
        var b = require('./b');
        b(1).should.equal('b(1): a(1)');
    });
    it('directly required function can not be mocked', function(){
        var a = require('./a');
        var spy = sinon.spy(a);
        a(1).should.equal('a(1)');
        spy.called.should.equal(false);
    });
    it('directly required object\'s function can be mocked via the required object (module.exports = {x: fn})', function(){
        var aa = require('./aa');
        var spy = sinon.spy(aa, 'a');
        aa.a(1).should.equal('a(1)');
        spy.called.should.equal(true);
    });
    it('directly required object\'s function can be mocked via the required object (module.exports.x = fn)', function(){
        var aa = require('./aaa');
        var spy = sinon.spy(aa, 'a');
        aa.a(1).should.equal('a(1)');
        spy.called.should.equal(true);
    });
    it('directly required object\'s function can not be mocked directly', function(){
        var aa = require('./aa');
        var spy = sinon.spy(aa.a);
        aa.a(1).should.equal('a(1)');
        spy.called.should.equal(false);
    });
    it('indirectly required function can not be mocked', function(){
        var a = require('./a');
        var b = require('./b');
        var spy = sinon.spy(a);
        b(1).should.equal('b(1): a(1)');
        spy.called.should.equal(false);
    });
    it('indirectly required object\'s function can be mocked', function(){
        var aa = require('./aa');
        var ba = require('./ba');
        var spy = sinon.spy(aa, 'a');
        ba.b(1).should.equal('b(1): a(1)');
        spy.called.should.equal(true);
    });
});