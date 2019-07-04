// 强/弱类型是指类型检查的严格程度，为所有变量指定数据类型称为 “强类型”
/**
 * 9.1
 */
function inherit(p) {
  if (p == null) throw TypeError()
  if (Object.create) {
    return Object.create(p)
  }
  var t = typeof p;
  if (t !== "object" && t !== "function") throw TypeError()
  function f(){}
  f.prototype = p;
  return new f()
}
// 工厂函数
function range(from, to) {
  var r = inherit(range.methods);
  r.from = from;
  r.to = to;
  return r;
}
range.methods = {
  includes: function(x) {
    return this.from <= x && x <= this.to;
  },
  foreach: function(f) {
    for (var x = Math.ceil(this.from); x <= this.to; x++) {
      f(x)
    }
  },
  toString: function() {
    return "(" + this.from + "..." + this.to + ")";
  }
}
var r = range(1, 3);
r.includes(2);
r.foreach(console.log)
console.log(r)

/**
 * 9.2
 */
function Range(from, to) {
  this.from = from;
  this.to = to;
}
Range.prototype = {
  constructor: Range, /* 9.2.2 */
  includes: function(x) {
    return this.from <= x && x <= this.to;
  },
  foreach: function(f) {
    for (var x = Math.ceil(this.from); x <= this.to; x++) {
      f(x)
    }
  },
  toString: function() {
    return "(" + this.from + "..." + this.to + ")";
  }
}
var r = new Range(1, 3);
r.includes(2);
r.foreach(console.log)
console.log(r)
console.log(r instanceof Range)
/**
 * 9.3
 */
function extend(o, p) {
  for (prop in p) {
    o[prop] = p[prop]
  }
  return o;
}
function defineClass(constructor, methods, statics) {
  if (methods) extend(constructor.prototype, methods)
  if (statics) extend(constructor, statics)
  return constructor;
}
var SimpleRange = defineClass(function(f, t) { this.f = f; this.t = t;}, {
  includes: function(x) { return this.f <= x && x <= this.t;},
  toString: function() { return this.f + "..." + this.t}
}, {
  upto: function(t) { return new SimpleRange(0, t);}
})
console.dir(SimpleRange.upto(3) instanceof SimpleRange); // true

// Complex.js
function Complex(real, imaginary) {
  if (isNaN(real) || isNaN(imaginary)) {
    throw new TypeError();
  }
  this.r = real;
  this.i = imaginary;
}
Complex.prototype.add = function(that) {
  return new Complex(this.r + that.r, this.i + that.i)
}
Complex.prototype.mul = function(that) {
  return new Complex(this.r * that.r - this.i * that.i, this.r * that.i + this.i * that.r);
}
Complex.prototype.mag = function() {
  return Math.sqrt(this.r * this.r + this.i * this.i);
}
Complex.prototype.neg = function() {
  return new Complex(-this.r, -this.i)
}
Complex.prototype.toString = function() {
  return "{" + this.r + "," + this.i + "}";
}
Complex.prototype.equals = function(that) {
  return that != null &&
         that.constructor === Complex &&
         this.r === that.r &&
         this.i === that.i;
}
/**
 * 类字段和类方法直接定义为构造函数的属性
 */
Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);
Complex.parse = function(s) {
  try {
    var m = Complex._format.exec(s);
    return new Complex(parseFloat(m[1]), parseFloat(m[2]));
  } catch(x) {
    throw new TypeError("Can't parse '" + s + "' as a complex number.");
  }
}
Complex._format = /^\{([^,]+),([^}]+)\}$/;
var c = new Complex(2, 3);
var d = new Complex(c.i, c.r);
c.add(d).toString();
Complex.parse(c.toString()).add(c.neg()).equals(Complex.ZERO);

/**
 * 9.4
 */
Number.prototype.times = function(f, context) {
  var n = Number(this);
  for(var i = 0; i < n; i++) {
    f.call(context, i)
  }
}
var n = 3;
n.times(function(n) {
  console.log(n + " hello");
})

String.prototype.trim = String.prototype.trim || function() {
  if (!this) return this
  return this.replace(/^\s+|\s+$/g, "");
}
Function.prototype.getName = function() {
  return this.name || this.toString().match(/function\s*([^()*]\(/)[1];
}

/**
 * 9.5
 */
