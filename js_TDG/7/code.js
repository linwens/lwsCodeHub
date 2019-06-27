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
var keys = Object.keys();
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

 