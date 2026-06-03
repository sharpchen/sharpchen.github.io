const fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
const f = fruits.entries();

console.log([][Symbol.iterator]());

for (let x of f) {
  console.log(x);
}

function* gen() {
  yield 1;
  yield 2;
}

console.log([...gen()]);

const g = gen();
console.log(g.next()); // { value: 1, done: false }
console.log(g.next()); // { value: 2, done: false }
console.log(g.next()); // { value: 3, done: false }
console.log(g.next()); // { value: undefined, done: true }
console.log(g.return()); // { value: undefined, done: true }
console.log(g.return(1)); // { value: 1, done: true }

const array = [...'abc'];

for (const it of array.entries()) {
  console.log(it); // [0, 'a'] ...
}

Array.from.apply();
