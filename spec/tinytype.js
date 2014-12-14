var expect = require('chai').expect,
    TinyType = require('..');

describe('The Tiny Types library', function() {
    describe('Allows us to define a new Tiny Type', function() {
        var Email = TinyType();
        it('Emits a Constructor function', function() {
            expect(Email).to.be.a('function');
        });
        it('Can instantiate a new Tiny Type from this constructor', function() {
            var email = new Email('graham@grahamcox.co.uk');
            expect(email).to.be.an.instanceOf(Email);
        });
        it('Can return our value from the instance', function() {
            var email = new Email('graham@grahamcox.co.uk');
            expect(email.value).to.equal('graham@grahamcox.co.uk');
        });
    });
});
