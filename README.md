tinytypes-js
============

Implementation of Tiny Types for Javascript


What are Tiny Types?
--------------------
Tiny Types are a mechanism using the Type System that allows us greater safety over the values we are passing around. Take, for example, the following method:

    function registerUser(username, realName, email) {}

When the user calls this function, they need to know the order in which to pass parameters in. If they don't, then in a weakly typed system it will cause weird things to happen. Imagine, for example, if we swapped thr username and realName values around by accident. This would cause everything to keep working, but all new users would be required to log in with whatever they input for their real name as their username. Less than useful.

But Javascript doesn't do type safety
-------------------------------------

Yes it does. It's not all that well know, but Javascript has an *instanceof* operator that will return true of false if a given variable is of a given type. This does require us to start using types though. 

This is all perfectly achievable right now, but a bit on the verbose side, as follows:

    function Username(value) {
        Object.defineProperties(this, {
            value: {
                configurable: false,
                enumerable: true,
                writable: false,
                value: value
            }
        });
    }

    function registerUser(username, realName, email) {
        if (!username instanceof Username) {
            throw new Error("First parameter must be a Username");
        }
    }

If we pass in anything but a Username object to the above, then we will get an error thrown. This means that after these assertions we can guarantee that the username parameter is a Username object.

So what does this library give me?
----------------------------------

In the simple case, nothing. However, it does make life a lot easier for the implementation of these types. It makes use of Object.defineProperties to ensure that the value property on our new Tiny Type is read-only, and it also guarantees that the new Tiny Type is constructed with only a single parameter. The above becomes the following:

    var Username = TinyType();

instead of the full function definition. The above also provides the following:

    var username = new Username(); // Throws - needs a parameter
    var username = new Username('a', 'b'); // Throws - needs exactly one parameter

And of course, we can use *instanceof* to ensure the type of our username parameter matches the Username type.

On top of the simple case though, Tiny Types that are defined using this library gain some extra features that - whilst not difficult to code yourself - make life even easier. To see these, keep reading.

Data Validation
---------------
Tiny Types created by this library gain the ability to validate the input value, to ensure that it fits the requirements. Right now there are some simple validations built in for checking the data type, and for String and Number types, but there is also the ability to provide your own validation function.

The following Tiny Type will only accept numbers as the parameter, and the number must be in the range 1 to 100. If it is not a number, or it is outside of this range then the constructor will throw an error.
    var PageSize = TinyType({
        type: 'number',
        minValue: 1,
        maxValue: 100
    });

    new PageSize(10); // Works
    new PageSize('50'); // Throws - Input is a string
    new PageSize(0); // Throws - too small
    new PageSize(1000); // Throws - too big

The following Tiny Type will only accept strings that are of the expected size. 

    var Username = TinyType({
        type: 'string',
        minLength: 5,
        maxLength: 30
    });

    new Username('graham'); // Works
    new Username('gc'); // Throws - Input is too short
    new Username('ThisIsAVeryLongUsernameThatIShouldNotUse'); // Throws - Input is too long

The following Tiny Type will only accept strings that are of the expected regular expression. Note - Do NOT validate email addresses like this!

    var Email = TinyType({
        type: 'string',
        regex: /^.+@.+\..+$/
    });

    new Email('graham@grahamcox.co.uk'); // Works
    new Email('graham'); // Throws

The following Tiny Type will provide some custom validation rules.

    var Password = TinyType({
        type: 'string', 
        validator: function(value) {
            return value !== 'password';
        }
    });

    new Password('secret'); // Works
    new Password('password'); // Fails - our custom validator enforces that this value isn't used

Default Values
--------------
In some cases, we want to be able to store a default value if one isn't provided, instead of failing. This is unusual but not unheard of. The Tiny Types library can support a default value being either a single hard-coded value or a function that will generate a value. Regardless, this must meet any validation requirements that are imposed on the type.

    var DateTime = TinyType({
        defaultValue: function() { return new Date(); }
    });

    new DateTime(new Date(Date.parse("2014-12-15"))); // Works, storing the provided time
    new DateTime(); // Works, storing the current time

    var Page = TinyType({
        type: 'number',
        minValue: 0,
        defaultValue: 0
    });

    new Page(1); // Works, storing 1
    new Page(); // Works, storing 0
    
Optional Values
---------------
Occasionally we just outright don't want to store a value. And this is fine. As such, we can choose to mark a property as optional instead, in which case if no value is passed in and no default is specified we will just store undefined. This totally skips all validation tests if we don't have a value to store, but if we do have a value then it must be valid

    var Age = TinyType({
        type: 'number',
	optional: true
    });
    new Age(18); // Valid - Stores 18
    new Age(); // Valid - Stores undefined
    new Age(undefined); // Valid - Stores undefined
    new Age('Three'); // Invalid

Property Name
-------------
By default, the property name that the stored value is exposed on is 'value'. This can be overridden to any name you want as long as it's a valid Object property key simply by specifying the name as a configuration value. For example:

    var Email = TinyType({
        name: 'email'
    });

    new Email('graham@grahamcox.co.uk').email; // This is where the value is stored
    new Email('graham@grahamcox.co.uk').value; // This is now undefined


Multiple Properties
-------------------
In some circumstances it is useful to have multiple properties on a Tiny Type. This is also supported, and can be achievd by simply passing in multiple definitions to the Tiny Type method. 

    var Email = TinyType({
        name: 'username',
        type: 'string',
        regex: /^[^@]$/
    }, {
        name: 'domain',
        type: 'string'
    });

In this case, we can construct a new instance of our Tiny Type class by either passing in multiple parameters like normal, or by passing in a single object that contains named parameters. 

    new Email('graham', 'grahamcox.co.uk').username === 'graham';
    new Email('graham', 'grahamcox.co.uk').domain === 'grahamcox.co.uk';
    new Email({username: 'graham', domain: 'grahamcox.co.uk'}).username === 'graham';
    new Email({username: 'graham', domain: 'grahamcox.co.uk'}).domain === 'grahamcox.co.uk';

As always, these fields must pass validation, and if you use the first form then they must be in the exact same order that they were defined in the Tiny Type definition. If a name is not provided, only the first one will use a default property name of 'value'. All others must have a name.
