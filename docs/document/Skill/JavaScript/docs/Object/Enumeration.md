# Enumeration

JavaScript has distinction about property ownership, so it offers some different ways to enumerate properties.
The most critical difference is whether they enumerate properties from the object's prototype.

## Enumerating All Keys

`for..in` enumerates *every key* within an object, **including own properties and properties inherited from prototype, excluding symbols**.


```js
const person = {
  name: 'john',
  age: 18
};

for (let key in person) {
  // name
  // age
  console.log(key)
}

for (let idx in ['a', 'b', 'c']) {
  console.log(typeof idx) // always string // [!code highlight]
}
```

However this loop also iterates members from `prototype`, to ignore inherited properties, use a guard like this:

```js
Object.prototype.foo = 'foo' // add parent property // [!code highlight]

const person = {
  name: 'john',
  age: 18,
};

for (const key in person) {
  if (person.hasOwnProperty(key)) { // [!code highlight]
    console.log(key); // [!code highlight]
  } // [!code highlight]
}
```

## Iterable Interface <Badge type="info" text="ES6+" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol" />

JavaScript exposed a *iterable* interface by implementing `[Symbol.iterable]` property, available `for..of` statement to enumerate.
JavaScript requires the `[Symbol.iterator]` property return a object with `next()` method when being called, with the ability of closuring, it can iterate conditionally with a response shape(`IteratorResult` in TypeScript)
The shape returned from the `next` method should contain a `value` which is the current value of iteration, and a indicator `done` to tell when to terminate the iteration.
You may also use `break` keyword to terminate explicitly, `continue` to go to next iteration within the `next` method.


> [!TIP]
> `String`, `Array` and other common collections are iterable.

```js
const iterable = {
  [Symbol.iterator]() {
    let i = 1; // outer storage for closure // [!code highlight]
    return {
      next() {
        if (i <= 3) {
          return { value: i++, done: false };
        }
        return { value: undefined, done: true }; // indicator `done` // [!code highlight]
      },
    };
  },
}

for (const val of iterable) {
  console.log(val);
}
```

### Termination

A quirk about `for..of` is, the generator will be expired after the loop was terminated by [`break`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of#early_exiting).

```js
function* g() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = g();

for (const item of generator) {
  break // we enumerate nothing
}

// generator became exhausted after break
console.log([...generator]) // [] // [!code highlight]
```

You may also terminate using [`generator.return(value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return), where the value can be the last value enumerated.
It's also quirky that you can call `generator.return` arbitrary times even after the generator was finished.

```js
function* gen() {
  yield 1;
  yield 2;
}

const g = gen();

g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.next(); // { value: undefined, done: true }

g.return(); // { value: undefined, done: true }
g.return(1); // { value: 1, done: true }
```

### Expanding Iterable <Badge type="info" text="ES6+" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#syntaxes_expecting_iterables" />

An object implemented `[Symbol.iterator]` can be expanded by spread operator:

```js
_ = [...'abc'] // expand to 'a', 'b', 'c'
```

> [!NOTE]
> Additionally you can expand iterable to an object, with the integer index(as string) as key, **since ES9**.
>```js
>_ = { ...'abc' } // { '0': 'a', '1': 'b', '2': 'c' }
>```

## Enumeration Utilities

`Object` provides some utility function to "enumerate" an object, in a **non-iterative** way, which means they don't return a iterator but a whole collection of enumerated.
The these functions only enumerate object's **own properties**.

- `Object.keys`(`ES6+`)
- `Object.entries`(`ES8+`)
- `Object.values`(`ES8+`)

```js
const obj = { a: 5, b: 7, c: 9 };
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
}
```

For builtin collection types, such as `Array` and `Set`, we have iterative methods from its *prototype*, they all return **iterator** instead.

- `*.prototype.keys`
- `*.prototype.values`
- `*.prototype.entries`

```js
const array = [...'abc'];

for (const it of array.entries()) {
  console.log(it); // [0, 'a'] ...
}
```

## Enumerable Property

A property with `enumerable: true` in its descriptor is visible during iteration.

```js
const object = {};

Object.defineProperty(object, "foo", {
  enumerable: false // [!code highlight]
});
```

> [!NOTE]
> See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#enumerable
