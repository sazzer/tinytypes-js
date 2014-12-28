'use strict';

/**
 * Function to generate a new class to be used as a Tiny Type
 * @return the constructor for the new type
 */
function TinyType() {
    var valueDefs = [],
        keyIndices = {};

    if (arguments.length === 0) {
        valueDefs.push({});
    } else {
        for (var i = 0; i < arguments.length; ++i) {
            valueDefs.push(arguments[i]);
        }
    }
    if (valueDefs.length === 1 && typeof valueDefs[0].name === 'undefined') {
        valueDefs[0].name = 'value';
    }

    valueDefs.forEach(function(valueDef, i) {
        keyIndices[valueDef.name] = i;
    });

    return function() {
        if (arguments.length > valueDefs.length) {
            throw new Error('Expected no more than ' + valueDefs.length + ' arguments. Got ' + arguments.length);
        }

        var inputs = [];
        if (arguments.length === 1 && typeof arguments[0] === 'object' && valueDefs.length > 1) {
            // We expect multiple values, we only have a single input and it's an object. Assume that this is key/value pairs for the values
            var data = arguments[0];
            Object.keys(keyIndices).forEach(function(key, index) {
                inputs[index] = data[key];
            });
        } else {
            for (var valueDefId = 0; valueDefId < valueDefs.length; ++valueDefId) {
                if (arguments.length > valueDefId) {
                    inputs.push(arguments[valueDefId]);
                } else {
                    inputs.push(undefined);
                }
            }
        }

        var properties = {};

        for (var inputId = 0; inputId < inputs.length; ++inputId) {
            var value = inputs[inputId],
                valueDef = valueDefs[inputId];

            if (typeof value === 'undefined') {
                switch (typeof valueDef.defaultValue) {
                case 'undefined':
                    if (valueDef.optional !== true) {
                        throw new Error('Expected a value to be passed in. Got undefined');
                    }
                    break;
                case 'function':
                    value = valueDef.defaultValue();
                    break;
                default:
                    value = valueDef.defaultValue;
                    break;
                }
            }
            // By this point we have a value, or if we have Undefined it's because we're optional
            if (typeof value !== 'undefined' && valueDef.type) {
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
                        case 'number':
                            if (typeof valueDef.minValue === 'number' && value < valueDef.minValue) {
                        throw new Error('Expected value to be at least ' + valueDef.minValue);
                    }
                            if (typeof valueDef.maxValue === 'number' && value > valueDef.maxValue) {
                        throw new Error('Expected value to be at most ' + valueDef.maxValue);
                    }
                    break;

                }
            }
            if (typeof valueDef.validator === 'function' && !valueDef.validator(value)) {
                throw new Error('Value passed in was not valid');
            }

            properties[valueDef.name] = {
                configurable: false,
                enumerable: true,
                writable: false,
                value: value
            }
        }

        Object.defineProperties(this, properties);
    };
};

module.exports = TinyType;
