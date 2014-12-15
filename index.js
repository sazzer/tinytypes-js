'use strict';

var util = require('util');

/**
 * Function to generate a new class to be used as a Tiny Type
 * @return the constructor for the new type
 */
function TinyType(definition) {
    var valueDef = definition || {};

    return function(value) {
        if (arguments.length !== 1) {
            throw new Error('Expected exactly one argument. Got ' + arguments.length);
        }
        if (typeof value === 'undefined') {
            throw new Error('Expected a value to be passed in. Got undefined');
        }
        if (valueDef.type) {
            if (typeof value !== valueDef.type) {
                throw new Error('Expected a ' + valueDef.type + ' to be passed in. Got a ' + typeof value);
            }
	    // Perform certain type-specific validations
	    switch (valueDef.type) {
	        case 'string':
		    if (valueDef.regex && !valueDef.regex.test(value)) {
		        throw new Error('Expected value to match regular expression: ' + valueDef.regex);
		    }
                    if (typeof valueDef.minLength === 'number' && value.length < valueDef.minLength) {
		        throw new Error('Expected value to be at least ' + valueDef.minLength + ' characters long');
		    }
                    if (typeof valueDef.maxLength === 'number' && value.length > valueDef.maxLength) {
		        throw new Error('Expected value to be at most ' + valueDef.maxLength + ' characters long');
		    }

		    break;
	    }
	}
        if (typeof valueDef.validator === 'function' && !valueDef.validator(value)) {
            throw new Error('Value passed in was not valid');
        }
        Object.defineProperties(this, {
            value: {
                configurable: false,
		enumerable: true,
		writable: false,
		value: value
            }
        });
    };
}

module.exports = TinyType;
