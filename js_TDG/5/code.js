/**
 * 5.2
 */
// 下面是一个语句块
{
  x = Math.PI;
  cx = Math.cos(x);
  console.log("cos(π) = " + cx)
}
// 空语句
var a = []
for (i = 0; i < a.length; a[i++] = 0 ); /* empty */

/**
 * 5.5.1
 */
var count = 0;
while (count < 10) {
  console.log(count)
  count++;
}

/**
 * 5.5.2
 */
function printArray(a) {
  var len = a.length, i = 0;
  if (len == 0) {
    console.log("Empty Array")
  } else {
    do {
      console.log(a[i]);
    } while (++i < len);
  }
}
printArray('ab')

/**
 * 5.5.3
 */
function tail(o) {
  for(; o.text; o = o.next) /* empty */
  return o;
}
/**
 * 5.5.4
 */
var o = {x: 1, y: 2, z: 3};
var a = [], i = 0;
for (a[i++] in o) { /* empty */ }
console.log(a) // ['x', 'y', 'z']
for ( i in a ) console.log(i) // 0 1 2

/**
 * 5.6.2
 */
var matrix = [[1, 2, 3], [6, 7, 8], [4, 5, 9]];
var sum = 0, success = false;

// compute_sum: 是个表标签语句
compute_sum: if (matrix) {
  for (var x = 0;  x < matrix.length; x++) {
    var row = matrix[x];
    if (!row) break compute_sum;
    for (var y = 0; y < row.length; y++) {
      var cell = row[y];
      if (isNaN(cell)) break compute_sum
      sum += cell
    }
  }
  success = true;
}
console.log(sum) // 45
/**
 * 5.6.5
 */
function factorial(x) {
  if (x < 0) throw new Error("x不能是负数");

  for (var f=1; x>1; f*=x, x--){}
  console.log(f)
  return f
}
factorial(10)
/**
 * 5.6.6
 */
try {
  var n = Number(prompt("请输入一个正整数", ""));
  var f = factorial(n);
  alert(n+"| = "+f)
} catch (ex) {
  alert(ex)
}