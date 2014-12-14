'use strict';

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
        if (valueDef.type && typeof value !== valueDef.type) {
            throw new Error('Expected a ' + valueDef.type + ' to be passed in. Got a ' + typeof value);
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
