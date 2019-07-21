/**
 * 4.7 运算符
 */
// 一些运算符由关键字表示，如 delete 

/**
 * 4.8.1
 */
  1 + 2 // 3
  "1" + "2" // "12"
  "1" + 2 // "12"
  1 + {} // "1[object Object]"
  true + true // 2
  2 + null // 2
  2+ undefined // NaN

/**
 * 4.8.2 一元算术运算符
 */
  var i = 1, j = ++i; // i和j的值都是2    （前增量）
  var a = 1, b = a++; // a是2，b是1   （后增量）
 // 递减 同 递增

 /**
  * 4.8.3 位运算符（跳过）
  */

/**
 * 4.9 in、instanceof 属于关系运算符
 */

 /**
  * 4.10.1
  */
// 利用逻辑与 && 的短路（short circuiting）来执行代码
if (a == b) stop()
(a == b) && stop()

/**
 * 4.12.2
 */
var geval = eval
var x = "global", y = "global";
function f() {
  var x = "local";
  eval("x += 'changed';") // 这里的x指的是局部变量x,(直接调用eval()时，它总是在调用它的上下文作用域内执行)
  return x
}
function g() {
  var y = "local";
  geval("y += 'changed';") // geval是在全局下定义的，此处的调用this指向window，变量y指的是全局下的y
  return y
}
console.log(f(), x)
console.log(g(), y)

/**
 * 4.13.5 逗号运算符
 */
for (var i = 0, j = 10; i < j; i++, j--) {
  console.log(i + j)
}