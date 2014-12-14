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
        this.value = value;
    }

    function registerUser(username, realName, email) {
        if (!username instanceof Username) {
            throw new Error("First parameter must be a Username");
        }
    }

If we pass in anything but a Username object to the above, then we will get an error thrown. This means that after these assertions we can guarantee that the username parameter is a Username object.

So what does this library give me?
----------------------------------

Realistically, nothing. However, it does make life a lot easier for the implementation of these types. It makes use of Object.defineProperties to ensure that the value property on our new Tiny Type is read-only, and it also guarantees that the new Tiny Type is constructed with only a single parameter. The above becomes the following:

    var Username = TinyType();

instead of the full function definition. The above also provides the following:

    var username = new Username(); // Throws - needs a parameter
    var username = new Username('a', 'b'); // Throws - needs exactly one parameter

And of course, we can use *instanceof* to ensure the type of our username parameter matches the Username type.
