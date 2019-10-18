/**
 * 14.5.1
 */
// 命令式
const printArray = function(array) {
  for (var i = 0; i < array.length; i++) {
    console.log(array[i])
  }
}
printArray([1,2,3,4,5])

// 函数式
const forEach = function(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i]);
  }
}
const logItem = function(item) {
  console.log(item);
}
forEach([1, 2, 3, 4, 5], logItem);

/**
 * 14.5.2
 */
// 命令式
var findMinArray = function(array) {
  var minValue = array[0];
  for (var i = 1; i < array.length; i++) {
    if (minValue > array[i]) {
      minValue = array[i]
    }
  }
  return minValue;
}
console.log(findMinArray([8, 6, 4, 5, 9]));

// 函数式
const min_ = function(array) {
  return Math.min(...array);
}
console.log(min_([8, 6, 4, 5, 9]));

/**
 * 14.5.3 函数式工具箱
 */
// 命令式
const daysOfWeek = [
  {name: 'Monday', value: 1},
  {name: 'Tuesday', value: 2},
  {name: 'Wednesday', value: 7}
];

let daysOfWeekValues_ = [];
for (let i = 0; i < daysOfWeek.length; i++) {
  daysOfWeekValues_.push(daysOfWeek[i].value);
}
// 函数式
const daysOfWeekValues = daysOfWeek.map(day => day.value);

//--------------------
// 命令式
const positiveNumbers_ = function(array) {
  let positive = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] >= 0) {
      positive.push(array[i]);
    }
  }
  return positive;
}
console.log(positiveNumbers_([-1, 1, 2, -2]));
// 函数式
const positiveNumbers = (array) => array.filter(num => (num >= 0));
console.log(positiveNumbers([-1, 1, 2, -2]));

//--------------------
//命令式
const sumValues = function(array) {
  let total = array[0];
  for (let i = 1; i < array.length; i++) {
    total += array[i];
  }
  return total;
}
console.log(sumValues([1, 2, 3, 4, 5]));
//函数式
const sum_ = function(array) {
  return array.reduce(function(a, b) {
    return a + b;
  })
}
console.log(sum_([1, 2, 3, 4, 5]))
const sum = arr => arr.reduce((a, b)=> a + b);
console.log(sum([1, 2, 3, 4, 5]));

//------------------
//命令式
const mergeArrays_ = function(arrays) {
  const count = arrays.length;
  let newArray = [];
  let k = 0;
  for (let i = 0; i < count; i++) {
    for (var j = 0; j < arrays[i].length; j++) {
      newArray[k++] = array[i][j];
    }
  }
  return newArray;
}
console.log(mergeArrays_([1, 2, 3], [4, 5], [6]));

//函数式
const mergeArraysConcat = function(arrays) {
  return arrays.reduce(function(p, n) {
    return p.concat(n);
  })
}
console.log(mergeArraysConcat([1, 2, 3], [4, 5], [6]));
const mergeArrays = (...arrays) => [].concat(...arrays);
console.log(mergeArrays([1, 2, 3], [4, 5], [6]));

