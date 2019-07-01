/**
 * 8.1
 */
function printprops(o) {
  for (var p in o) {
    console.log(p + ": " + o[p] + "\n")
  }
}
function distance(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx*dx + dy*dy);
}
function factorial(x) {
  if (x <= 1) return 1
  return x * factorial(x-1);
}
var square = function(x) { return x*x };
var f = function fact(x) {
  if (x <= 1) {
    return 1
  } else {
    return x*fact(x-1)
  }
}
var data = []
data.sort(function(a, b) { return a-b });
var tensquared = (function(x) {return x*x}(10));

/**
 * 8.2.1
 */
// 判断是否是严格模式
var strict = (function() { return !this}());

/**
 * 8.2.2
 */
var calculator = {
  operand1: 1,
  operand2: 1,
  add: function() {
    this.result = this.operand1 + this.operand2
  }
}
calculator.add();
calculator.result // 2

var o = {
  m: function() {
    var self = this;
    console.log(this === o)
    f();
    function f() {
      console.log(this === o)
      console.log(self === o)
    }
  }
}

/**
 * 8.3.1
 */
function getPropertyNames(o, /* optional */ a) {
  a = a || []
  for (var property in o) a.push(property)
  return a;
}
var a = getPropertyNames(o);
var p = {}
getPropertyNames(p, a)

/**
 * 8.3.2
 */
function f(x, y, z) {
  // 校验实参个数是否正确
  if (arguments.length != 3) {
    throw new Error('function f called with ' + arguments.length + 'arguments, but it expects 3 arguments.');
  }
}

function max(/* ... */) {
  var max = Number.NEGATIVE_INFINITY; // -Infinity
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] > max) max = arguments[i]
  }
  return max;
}
var largest = max(1, 10, 100, 2, 3, 1000, 4, 5, 10000, 6);
