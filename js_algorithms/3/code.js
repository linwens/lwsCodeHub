/**
 * 3.2
 */
const fibonacci = [];
fibonacci[1] = 1;
fibonacci[2] = 1;

for(let i = 3; i < 20; i++) {
  fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
}

for (let i = 1; i < fibonacci.length; i++) {
  console.log(fibonacci[i])
}

/**
 * 3.3.2
 */
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
numbers[numbers.length] = 10;
numbers.push(11);
numbers.push(12, 13);
Array.prototype.insertFirstPosition = function(value) {
  for (let i = this.length; i >= 0; i--) {
    this[i] = this[i -1];
  }
  this[0] = value;
};
numbers.insertFirstPosition(-1);
numbers.unshift(-2);
numbers.unshift(-4, -3);
numbers.pop();

Array.prototype.reIndex = function(myArray) {
  const newArray = [];
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i] !== undefined) {
      newArray.push(myArray[i])
    }
  }
  return newArray;
}
Array.prototype.removeFirstPosition = function() {
  for (let i = 0; i < this.length; i++) {
    this[i] = this[i + 1];
  }
  return this.reIndex(this);
}

numbers = numbers.removeFirstPosition();

/**
 * 3.5
 */
numbers.splice(5, 3, 2, 3, 4);

/**
 * 3.6.1
 */
let averageTemp = [];
averageTemp[0] = [72, 75, 79, 79, 81, 81];
averageTemp[1] = [81, 79, 75, 75, 73, 73];
console.table(averageTemp);

function printMatrix(myMatrix) {
  for (let i = 0; i < myMatrix.length; i++) {
    for (let j = 0; j < myMatrix[i].length; j++) {
      console.log(myMatrix[i][j]);
    }
  }
}
printMatrix(averageTemp);

/**
 * 3.6.2
 */
const matrix3x3x3 = [];
for (let i = 0; i <3; i++) {
  matrix3x3x3[i] = [];
  for (let j = 0; j < 3; j++) {
    matrix3x3x3[i][j] = [];
    for (let z = 0; z < 3; z++) {
      matrix3x3x3[i][j][z] = i + j + z;
    }
  }
}
console.table(matrix3x3x3);

/**
 * 3.7
 */
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const isEven = x => x % 2 === 0;

numbers.every(isEven);

numbers.some(isEven);

let result = numbers.reduce((previous, current) => previous + current, 1); // 第一个参数累加的初始值，默认0

/**
 * 3.7.3
 */
for (const n of numbers) {
  console.log(n % 2 === 0 ? 'even' : 'odd')
}

let iterator = numbers[Symbol.iterator]();
for (const n of iterator) {
  console.log(n);
}

let aEntries = numbers.entries();
for (const n of aEntries) {
  console.log(n);
}

const aKeys = numbers.keys();
console.log(aKeys.next());

const aValues = numbers.values();
console.log(aValues.next());

let numbers2 = Array.from(numbers);

let evens = Array.from(numbers, x => (x % 2 == 0));

let numbers3 = Array.of(1);
let numbers4 = Array.of(1, 2, 3, 4, 5, 6);
let numbersCopy = Array.of(...numbers4);
numbersCopy.fill(0);
numbersCopy.fill(2, 1);
numbersCopy.fill(1, 3, 5);
let ones = Array(6).fill(1);

let copyArray = [1, 2, 3, 4, 5, 6];
copyArray.copyWithin(0, 3);
copyArray = [1, 2, 3, 4, 5, 6];
copyArray.copyWithin(1, 3, 5);

/**
 * 3.7.4
 */
numbers.sort((a, b) => a - b); // 升序

const friends = [
  {name: 'John', age: 30},
  {name: 'Ana', age: 20},
  {name: 'Chris', age: 25},
];
function comparePerson(a, b) {
  if (a.age < b.age) {
    return -1;
  }
  if (a.age > b.age) {
    return 1;
  }
  return 0;
}
console.log(friends.sort(comparePerson));

/**
 * 3.7.5
 */
function multipleOf13(element, index, array) {
  return (element % 13 == 0)
}
console.log(numbers.find(multipleOf13));
console.log(numbers.findIndex(multipleOf13));

console.log(numbers.toString());
console.log(numbers.join('-'));

/**
 * 3.8
 */
let length = 5;
let int16 = new Int16Array(length);
let array16 = [];
array16.length = length;
for (let i = 0; i < length; i++) {
  int16[i] = i+1;
}
console.log(int16);
