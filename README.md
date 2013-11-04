Mocking and spying on required modules
======================================

Thq qustion is, "how do I unit test modules with dependancies under the common JS
module architecture?"

Goal
----

The goal here is to see what is required to unit test modules with dependancies when
it is required that you mock or spy on required functions.

Consider the following example:

    // controller.js
    var backend = require('./backend');

    module.exports = {
        index: function(req, res) {
            backend.findAll(function(models) {
                res.render(models);
            });
        }
    }

This should look familiar enough. Now lets write a unit test that ensures that we call
backend.findAll() whenever we call controller.index();

    // tests/controller.js
    var sinon = require('sinon');
    var should = require('chai').should();

    describe('controller', function() {
        it('index() calls backend.findAll()' function() {
            var backend = require('./backend');
            var controller = require('./controller');
            var res = { render: function(){} };
            var spy = sinon.spy(backend.findAll);
            controller.index({}, res);
            spy.called.should.equal(true);
        });
    });

Ok, lets take that step by step...

1. we require backend into our scope
2. we require controller into our scope
3. we make a dummy response object with a stubbed render method
4. we create a spy for backend.findAll() so we can test if it was called
5. we make the call we want to test
6. we ask our spy if backend.findAll() was called

No bananna
----------

And what happens? Our test fails. We'll come to why our test fails in a minute...

I wanna bananna!
----------------

So what do we have to do to get it working? 

If we give the backend object to sinon.spy() and specify the findAll method as the
spied property/function then it will work.

    // tests/controller.js
    var sinon = require('sinon');
    var should = require('chai').should();

    describe('controller', function() {
        it('index() calls backend.findAll()' function() {
            var backend = require('./backend');
            var controller = require('./controller');
            var res = { render: function(){} };
            var spy = sinon.spy(backend, 'findAll');
            controller.index({}, res);
            spy.called.should.equal(true);
        });
    });

The code above is exactly the same as our first attempt except for the creation of
the spy

    var spy = sinon.spy(backend, 'findAll');

Now when we run our test it will proudly proclaim that our spy was called.

So who hid my bananna?
----------------------

Why didn't the first attempt work?

When we gave backend.findAll to sinon.spy() it created a wrapper function in the local
scope which will call the original function, in this case backend.findAll(). When
the controller module requires the backend module it gets a reference to the instance
cached by the require infrastructure. The single instance of the backend module has a
reference to it's findAll function and this reference refers to the same function instance
as the spy's reference. So when controller calls it's backend.findAll() it isn't calling the
spy wrapper function it is calling the real function. When we finally ask the spy if it
was called it can only answer that it was not.

Why did the second attemp work?

The difference between the first and second attempt is that in the second attemp we provided
the enclosing backend object to the call to sinon.spy(). sinon.spy() then modified the
findAll property of the backend object to be a wrapper function that will eventually call
the original findAll(). Then when the controller calls backend.findAll() it is using the
mutated backend object whore findAll property now refers to the wrapper function and not the 
original findAll() function. So when we ask our spy if it's findAll() function was called
it can answer that it was because the controller called the mutated backend object's findAll
property and not the original function.