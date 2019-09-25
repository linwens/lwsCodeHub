/**
 * 1.3.2
 */
// 位运算符
console.log('5 & 1:', (5 & 1));
console.log('5 | 1:', (5 | 1));
console.log('~ 5:', (~5));
console.log('5 ^ 1:', (5 ^ 1));
console.log('5 << 1:', (5 << 1));
console.log('5 >> 1:', (5 >> 1));

/**
 * 1.3.4
 */
var person1 = {name: 'John'};
var person2 = {name: 'John'};
console.log(person1 === person2); // false

/**
 * 1.4.2
 */
var i = 0;
do { // 至少会执行一次
  console.log(i);
  i++
} while (i < 0);
