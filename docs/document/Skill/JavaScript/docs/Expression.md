# Expression

## Discard

`void` operator can be used to evaluate expression and discard the value, it always return `undefined`.


```js
void console.log('hello')
void (foo = 'bar')

// discard potential boolean return
checkbox.onclick = () => void trySomething() 
```
