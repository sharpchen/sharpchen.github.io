console.log("Hello from docker!");



class Person {
    name;
    age;
    constructor (name, age) {
        this.name = name;
        this.age = age;
    }
    toString() {
        return `I am ${this.name}, I am ${this.age} years old!`;
    }
}
const person = new Person('john', 18);
