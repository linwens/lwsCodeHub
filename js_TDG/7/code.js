/**
 * 7.4
 */
var a = [1,2,3,4,5];
a.length = 3; // [1,2,3]
a.length = 0; // []
a.length = 5; // [empty x 5]  -------注意这三行是个递进的过程...

/**
 * 7.6
 */
var o = {}
var keys = Object.keys(o);
var values = []
for(var i = 0; i < keys.length; i++) {
  var key = keys[i];
  values[i] = o[key]
}
//=====以下是优化
// 只查询一次数组长度
for (var i = 0, len = keys.length; i < len; i++) {}
// 排除null, undefined 不存在的元素
for (var i = 0, len = keys.length; i < len; i++) {
  if (!keys[i]) continue
}
// 只排除 undefined和不存在的元素
for (var i = 0, len = keys.length; i < len; i++) {
  if (keys[i] === undefined) continue
}
// 只排除不存在的元素
for (var i = 0, len = keys.length; i < len; i++) {
  if (!(i in keys)) continue
}
// for in 处理稀疏数组
var sparseArray = [1,,2]
for (var i in sparseArray) { // 不存在的索引不会遍历到
  var value = sparseArray[i]
}
// for in 循环会枚举继承的属性，所以要过滤
for (var i in keys) {
  if (!keys.hasOwnProperty(i)) continue
}

/**
 * 7.7
 */
var table = new Array(10);
for (var i =0; i<table.length; i++) {
  table[i] = new Array(10)
}
for (var row = 0; row < table.length; row++) {
  for (col = 0; col < table[row].length; col++) {
    table[row][col] = row*col;
  }
}
var product = table[5][7]; // 35

/**
 * 7.8.3
 */
var a = ['ant', 'Bug', 'cat', 'Dog'];
a.sort(); // ['Bug', 'Dog', 'ant', 'cat']
a.sort(function(s, t) {
  var a = s.toLowerCase();
  var b = t.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}) // ['ant', 'Bug', 'cat', 'Dog']

/**
 * 7.8.5
 */
var a = [1,2,3,4,5]
a.slice(-3, -2); // 3
console.log(a); // [1,2,3,4,5] 不改变原数组

/**
 * 7.8.9
 */
[1,2,3].toString(); // '1,2,3'
['a', 'b', 'c'].toString(); // 'a,b,c'
[1, [2, 'c']].toString() // '1,2,c'

/**
 * 7.9.1
 */
function foreach(arr, fn, _this) {
  try {
    arr.forEach(fn, _this)
  } catch(e) {
    if (e === foreach.break) return
    else throw e
  }
}
foreach.break = new Error("StopIteration")

/**
 * 7.9.3
 */
// 压缩稀疏数组
var dense = sparseArray.filter(function() {return true});
// 压缩空缺并删除undefined和null
a = a.filter(function(x) {return x !== undefined && x != null})

/**
 * 
 */
function extend(o, p) {
  for (prop in p) {
    o[prop] = p[prop]
  }
  return o;
}
function union(o, p) {
  return extend(extend({}, o), p)
}
var objects = [{x: 1, a: 1}, {y: 2, a: 2}, {z: 3, a: 3}]
var leftunion = objects.reduce(union); // {x: 1, a: 3, y: 2, z: 3}
var rightunion = objects.reduceRight(union); // {z: 3, a: 1, y: 2, x: 1}

/**
 * 7.9.6
 */
function findall(a, x) {
  var results = [],
      len = a.length,
      pos = 0;
  while(pos < len) {
    pos = a.indexOf(x, pos);
    if (pos === -1) break;
    results.push(pos);
    pos = pos + 1;
  }
  return results
}

/**
 * 7.10
 */
var isArray = Function.isArray || function(o) {
  return typeof o === "object" && Object.prototype.toString.call(o) === "[object Array]";
}

/**
 * 7.11
 */
var a = {};
var i = 0;
while(i < 10) {
  a[i] = i * i;
  i++
}
a.length = i;
var total = 0;
for (var j = 0; j < a.length; j++) {
  total += a[j];
}

// 检测类数组
function isArrayLike(o) {
  if (o && 
      typeof o === "object" &&
      isFinite(o.length) &&
      o.length >= 0 &&
      o.length === Math.floor(o.length) &&
      o.length < 4294967296) {
    return true
  } else {
    return false
  }
}

// 类数组调用数组的方法
Array.join = Array.join || function(a, sep) {
  return Array.prototype.join.call(a, sep);
}
Array.slice = Array.slice || function(a, from, to) {
  return Array.prototype.slice.call(a, from, to);
}
Array.map = Array.map || function(a, f, thisArg) {
  return Array.prototype.map.call(a, f, thisArg);
}

/**
 * 7.12
 */
var s = "JavaScript";
Array.prototype.join.call(s, " ");
Array.prototype.filter.call(s, function(x) {
  return x.match(/[^aeiou]/); // 只匹配非元音字母
}).join("")
