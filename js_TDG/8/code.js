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

/**
 * 8.3.3
 */
function arraycopy(
    /* array */ from, 
    /* index */ from_start, 
    /* array */ to, 
    /* index */ to_start, 
    /* integer */ length) {}
function easycopy(args) {
  arraycopy(args.from,
            args.from_start || 0,
            args.to,
            args.to_start || 0,
            args.length)
}
var a = [1,2,3,4], b = [];
easycopy({ from: a, to: b, length: 4})

/**
 * 8.3.4
 */
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
var isArray = Function.isArray || function(o) {
  return typeof o === "object" && Object.prototype.toString.call(o) === "[object Array]";
}

function sum(a) {
  if (isArrayLike(a)) {
    var total = 0;
    for (var i = 0; i <a.length; i++) {
      var element = a[i];
      if (element == null) continue
      if (isFinite(element)) total += element;
      else throw new Error("sum(): elements must be finite numbers");
    }
    return total
  } else {
    throw new Error("sum(): argument must be array-like");
  }
}

function flexisum(a) {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i], n;
    if (element == null) continue
    if (isArray(element)) { // 如果参数类型是数组，递归计算累加和
      n = flexisum.apply(this, element)
    } else if (typeof element === "function") {
      n = Number(element());
    } else {
      n = Number(element)
    }
    if (isNaN(n)) {
      throw new Error("flexisum(): can't convert" + element + " to number");
    }
    total += n
  }
  return total
}

var rslt = flexisum([1,2,4,null,function(){return 1}/* , function(){} */])

/**
 * 8.4
 */
function add(x, y) { return x + y; }
function subtract(x, y) { return x - y; }
function multiply(x, y) { return x * y; }
function divide(x, y) { return x / y; }

function operate(operator, operand1, operand2) {
  return operator(operand1, operand2);
}

var i = operate(add, operate(add, 2, 3), operate(multiply, 4, 5)); // 25
// -------
var operators = {
  add: function (x, y) { return x + y; },
  subtract: function (x, y) { return x - y; },
  multiply: function (x, y) { return x * y; },
  divide: function (x, y) { return x / y; },
  pow: Math.pow
}
function operate2(operation, operand1, operand2) {
  if (typeof operators[operation] === "function") {
    return operators[operation](operand1, operand2);
  } else {
    throw "unknown operator"
  }
}
var j = operate2("add", "hello", operate2("add", " ", "world")); // hello world
var k = operate2("pow", 10, 2); // 100

// 自定义函数属性
uniqueInteger.counter = 0;
function uniqueInteger() {
  return uniqueInteger.counter++;
}

// 计算阶乘
function factorial(n) {
  if (isFinite(n) && n >0 && n == Math.round(n)) { // 有限的正整数
    if (!(n in factorial)) {
      factorial[n] = n * factorial(n-1);
    }
    return factorial[n];
  } else {
    return NaN
  }
}
factorial[1] = 1;

/**
 * 8.5
 */
var extend = (function(){
  for (var p in {toString: null}) { // 处理IE的bug, 看看是否能正确便利toString熟悉
    return function extend(o) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var prop in source) {
          o[prop] = source[prop]
        }
      }
      return o;
    }
  }
  return function patched_extend(o) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      // 复制所有可枚举属性
      for (var prop in source) {
        o[prop] = source[prop];
      }
      // 检查特殊属性
      for (var j = 0; j < protoprops.length; j++) {
        prop = protoprops[j];
        if (source.hasOwnProperty(prop)) {
          o[prop] = source[prop];
        }
      }
    }
    return o;
  }
  // 需要检查的特殊熟悉
  var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString"];
}())

/**
 * 8.6
 */
var scope = "global scope";
function checkscope1() {
  var scope = "local scope";
  function f() {return scope;}
  return f();
}
checkscope1();
function checkscope2() {
  var scope = "local scope";
  function f() {return scope;}
  return f;
}
checkscope2()();

var uniqueInteger = (function(){
  var counter = 0;
  return function() { return counter++; }
}())

function counter() {
  var n = 0;
  return {
    count: function() { return n++;},
    reset: function() {n = 0}
  }
}
var c = counter(), d = counter();
c.count();
d.count();
c.reset();
c.count();
d.count();


