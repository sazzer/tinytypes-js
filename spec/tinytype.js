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
        it('Mandates that the new type is given a value', function() {
            expect(function() {
                new Email();
            }).throws();
        });
        it('Mandates that the new type is not given a value of undefined', function() {
            expect(function() {
                new Email(undefined);
            }).throws();
        });
        it('Mandates that the new type is given a single value', function() {
            expect(function() {
                new Email('graham', 'grahamcox.co.uk');
            }).throws();
        });
    });
    describe('Allows us to validate the inputs to the type', function() {
        describe('When we specify the type of the value', function() {
            var Email = TinyType({
	        type: 'string'
            });
	    it('Accepts an appropriate type', function() {
                var email = new Email('graham@grahamcox.co.uk');
		expect(email.value).to.equal('graham@grahamcox.co.uk');
	    });
	    it('Rejects an inappropriate type', function() {
            expect(function() {
                new Email(42);
            }).throws();
	    });
        });
    });
});
