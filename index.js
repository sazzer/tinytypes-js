'use strict';

/**
 * Function to generate a new class to be used as a Tiny Type
 * @return the constructor for the new type
 */
function TinyType() {
    return function(value) {
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
