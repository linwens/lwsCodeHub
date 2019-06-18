/**
 * 3.2.3
 */
// 字符串可以当做只读数组
var s = "hello, world"
console.log(s[0])
console.log(s[length-1])
/**
 * 3.5
 */
// 定义一个引用全局对象的全局变量
var global = this;
/**
 * 3.6
 */
var s = "test"
s.len = 4; // 这行代码执行，创建一个临时的字符串对象，并给这个对象的len属性赋值4，代码执行完，销毁临时字符串对象，所以读取len属性就是undefined  （这个临时对象就是 "包装对象"）
var t = s.len; // t=undefined

var s = "test", n = 1, b = true;
var S = new String(s);
var N = new Number(n);
var B = new Boolean(b);

console.log(typeof S) // object

/**
 * 3.7
 */
var o = {x:1}, p = {x:1};
console.log(o===p); // false
var a =[], b =[];
console.log(a===b); // false

var a =[];
var b = a;
b[0] = 1;
console.log(a[0]) // 1
console.log(a===b) // true

var a = ['a', 'b', 'c'];
var b = [];
for (var i = 0; i < a.length; i++) {
  b[i] = a[i]
}
// 不考虑是不是指向同一个引用类型，只考虑引用值（指针）是否相等
function equalArrays(a, b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !==b[i]) return false
  }
  return true;
}
/**
 * 3.8 JavaScript类型转换
 */
var kk = new Number(null) ; //
console.log(kk)
var jj = new String([]); //
var ll = new Number([]); //
console.log(jj)
console.log(ll)