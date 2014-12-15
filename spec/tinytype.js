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
    describe('Allows us to specify a default value', function() {
        var defaultValue = new Date().toISOString();
        var DateTime = TinyType({
            defaultValue: defaultValue
        });
        it('Uses the provided value if there is one', function() {
            var val = '2014-12-15T13:00:00Z'
            var now = new DateTime(val);
            expect(now.value).to.equal(val);
        });
        it('Uses the default if no value is passed in', function() {
            var now = new DateTime();
            expect(now.value).to.equal(defaultValue);
        });
        it('Uses the default if an undefined value is passed in', function() {
            var now = new DateTime(undefined);
            expect(now.value).to.equal(defaultValue);
        });
    });
    describe('Allows us to specify a default function', function() {
        var defaultValue = new Date().toISOString();
        var DateTime = TinyType({
            defaultValue: function() { return defaultValue; }
        });
        it('Uses the provided value if there is one', function() {
            var val = '2014-12-15T13:00:00Z'
            var now = new DateTime(val);
            expect(now.value).to.equal(val);
        });
        it('Uses the default if no value is passed in', function() {
            var now = new DateTime();
            expect(now.value).to.equal(defaultValue);
        });
        it('Uses the default if an undefined value is passed in', function() {
            var now = new DateTime(undefined);
            expect(now.value).to.equal(defaultValue);
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
        describe('When we provide a validation function', function() {
            var Email = TinyType({
	        type: 'string',
                validator: function(v) {
                    return (/^.+@.+\..+$/.test(v));
                }
            });
	    it('Accepts an appropriate value', function() {
                var email = new Email('graham@grahamcox.co.uk');
		expect(email.value).to.equal('graham@grahamcox.co.uk');
	    });
	    it('Rejects an inappropriate value', function() {
                expect(function() {
                    new Email('graham');
                }).throws();
	    });
        });
        describe('When we provide a regular expression to match', function() {
            var Email = TinyType({
	        type: 'string',
                regex: /^.+@.+\..+$/
            });
	    it('Accepts an appropriate value', function() {
                var email = new Email('graham@grahamcox.co.uk');
		expect(email.value).to.equal('graham@grahamcox.co.uk');
	    });
	    it('Rejects an inappropriate value', function() {
                expect(function() {
                    new Email('graham');
                }).throws();
	    });
        });
        describe('When we provide a string length to match', function() {
            var Short = TinyType({
	        type: 'string',
		maxLength: 3
            });
            var Long = TinyType({
	        type: 'string',
		minLength: 3
            });
	    it('Works under the maximum length', function() {
	        var input = '';
	        for (var i = 0; i <= 3; ++i) {
		    var value = new Short(input);
		    expect(value.value).to.equal(input);
		    input += 'a';
	        }
	    });
	    it('Rejects over the maximum length', function() {
                expect(function() {
                    new Short('graham');
                }).throws();
	    });
	    it('Works over the minimum length', function() {
	        var input = 'aaa';
	        for (var i = 0; i <= 3; ++i) {
		    var value = new Long(input);
		    expect(value.value).to.equal(input);
		    input += 'a';
	        }
	    });
	    it('Rejects under the minimum length', function() {
                expect(function() {
                    new Long('gc');
                }).throws();
	    });
        });
        describe('When we provide a number range to match', function() {
            var Short = TinyType({
	        type: 'number',
		maxValue: 3
            });
            var Long = TinyType({
	        type: 'number',
		minValue: 3
            });
	    it('Works under the maximum value', function() {
	        for (var i = 0; i <= 3; ++i) {
		    var value = new Short(i);
		    expect(value.value).to.equal(i);
	        }
	    });
	    it('Rejects over the maximum length', function() {
                expect(function() {
                    new Short(8);
                }).throws();
	    });
	    it('Works over the minimum length', function() {
	        for (var i = 3; i <= 6; ++i) {
		    var value = new Long(i);
		    expect(value.value).to.equal(i);
	        }
	    });
	    it('Rejects under the minimum length', function() {
                expect(function() {
                    new Long(2);
                }).throws();
	    });
        });
    });
});
