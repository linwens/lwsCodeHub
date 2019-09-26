/**
 * 3.9
 */
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface Person {
  name: string;
  age: number;
}

const friends: Person[] = [
  {name: 'John', age: 30},
  {name: 'Ana', age: 20},
  {name: 'Chris', age: 25}
];

function comparePerson(a: Person, b:Person) {
  if (a.age < b.age) {
    return -1;
  }
  if (a.age > b.age) {
    return 1;
  }
  return 0;
}