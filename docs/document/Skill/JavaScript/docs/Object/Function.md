# Function

## Chicken & Egg

Yes, functions are of `Object`. BUT, `Object` is function as well.
Don't get confused with it, it's just a convoluted **nominal relationship on the language level**.
It doesn't mean function and object are self-contradictory, JavaScript runtime can handle it in a real way.

```js
console.log(function() {} instanceof Object) // true
console.log(Object instanceof Function); // true
console.log(Function instanceof Object); // true

console.log(typeof Object);   // "function"
console.log(typeof String);   // "function"
console.log(typeof Function); // "function"
console.log(typeof Array);    // "function"
```

## The Function Caller

JavaScript exposes the *function caller* as `this` variable for each time it execute the function.
Meaning that a function can attach to **arbitrary context** during runtime.
What makes it drastic comparing to other languages like `lua` and `python` is, `this` is **implicitly available in every scope.**

Functions in JavaScript are not independent execution template like other scripting languages, they can be bound to any context while you're not aware of.

There are both explicit and implicit approaches to bind a caller to a function.

- Implicitly bind to containing object if the function is assign as member of the object
- Use `Function.prototype.call` or `Function.prototype.apply` to change caller explicitly.
- Create a new function from original one with caller bound using `Function.prototype.bind`.

```js
function add(c, d) {
  return this.a + this.b + c + d;
}

const o = { a: 1, b: 3 };

console.log(add.call(o, 5, 7)) // 16

console.log(add.apply(o, [10, 20])) // 34

const boundAdd = add.bind(o)
console.log(boundAdd(10, 20)) // 34

o.add = add // implicitly bind `this` to the containing object
o.add(10, 20) // 34
```

> [!NOTE]
> In non-strict mode, `this` has arbitrary value on top level(the default binding) depending on the runtime, because JavaScript does not have specification about it.
> In strict mode  JavaScript, `this` no longer exist on topmost scope.

> [!NOTE]
> `ES2020` added a `globalThis` variable as a standard interface to access the global context, it's **fixed** instead of a dynamic context like `this`.
> Different JavaScript runtime can have different member set within it,
> Any field declared in `globalThis` is globally accessible, pretty much similar to `_G` in `lua`.
>```js
>globalThis.foo = 'I am foo!'
>console.log(foo) // 'I am foo!'
>```

> [!IMPORTANT]
> You can't re-bind a bound function to change the caller again. `Function.prototype.bind` returns immutable binding for `this`.
> But you can append arguments with re-binding

### Function Member Declaration

By default JavaScript has implicit binding whenever you assign/declare function member to an object.
`ES6` introduced special **arrow function syntax** that does the orthogonal way, with no implicit binding at all, to inherit **pure closure**.

```js
const obj = {
  foo: function () {
    console.log(this === obj); // true
  },
  bar() {
    console.log(this === obj); // true
  },
  baz: () => {
    console.log(this === obj); // false
  },
};
```

### Binding in Callbacks

The very reason arrow function syntax was added is, to avoid context pollution when invoking callbacks.
Callbacks are executed in the context of certain api instead of the scope of containing object, meaning that you can't easily update the status of the object within callback.

```js
const assert = require('assert');

const obj = {
  count: 10,
  increment() {
    setTimeout(function () {
      this.count++; // `this` is not obj // [!code warning]
      assert(this === obj); // // [!code error]
    }, 300);
  },
};

obj.increment();
```

Before arrow function was a thing in JavaScript, we use `Function.prototype.bind` to explicitly handle the binding for callbacks.

```js
const assert = require('assert');

const obj = {
  count: 10,
  increment() {
    setTimeout(
      function () {
        assert(this === obj);
        this.count++;
        console.log(this.count); // 11
      }.bind(obj), // [!code highlight]
      300,
    );
  },
};

obj.increment();
```

Since `ES6` we can use arrow function as a simple solution:

```js
const assert = require('assert');

const obj = {
  count: 10,
  increment() {
    setTimeout(() => {
      assert(this === obj);
      this.count++;
      console.log(this.count); // 11
    }, 300);
  },
};

obj.increment();
```

However it's not certain whether the implementation behind would use `Function.prototype.bind` to implicitly set the caller of callbacks.
It's really dynamic and customizable depending on the library/runtime, we should **read its documentation first**.

```js
const button = document.querySelector('button');

button.addEventListener('click', function(e) {
  console.log(this === button); // true
});
```

### As Extra Context

`this` is an ambient placeholder everywhere, meaning that we can inject it as an extra argument for arbitrary function/callback etc.

```js
const callbackStore = {
  foo: function() {
      useContext(this); // [!code highlight]
  }
}

// somewhere internal..
function useCallback(callback, ctx) {
  callback.bind(ctx)();
}
```

However this approach is *implicit* and not too readable, because we don't know either the type of `this` or its semantic.
It's not typed in the parameter list, so we are much harder to find potential mistake during compile-time.
A modern approach is to avoid `this` as much as possible, and declare parameters for the callback, because nowadays we have typescript-powered community.
It's the same mental model for library developers, and much better readability for user's end.

```js
const callbackStore = {
  foo: function(ctx) {
      useContext(ctx); // [!code highlight]
  }
}

// somewhere internal..
function useCallback(callback, ctx) {
  callback(ctx);
}
```

## Callable Object

Given the design that a functions is valid object, we add can add properties to it.
So the term *callable object* isn't very correct in JavaScript, since the properties are attached to the function.
We may call it *objectified function* instead.

```js
const callable = function() {
  console.log('I am callable!');
};

callable.foo = 'foo';

callable()
console.log(callable.foo) // foo
```

## Generator Function <Badge type="info" text="ES6+" />

ES6 added generator function that can be consumed by `for..of` statement and array spread operator.

```js
function* g() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = g();

console.log(generator.next().value); // 1

console.log([...generator]); // [2, 3]

for (const item of generator) {
  console.log(item); // unreachable because the generator has finished // [!code warning]
}
```

