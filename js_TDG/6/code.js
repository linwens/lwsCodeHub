/**
 * 6.1.4
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

/**
 * 6.2.1
 */
function getvalue(protfolio) {
  var total = 0.0
  for (stock in protfolio) {
    var shares = protfolio[stock]
    var price = getquote(stock)
    total += shares * price
  }
  return total;
}

/**
 * 6.2.3
 */
var len = undefined;
var book = undefined;
if (book) {
  if (book.subtitle) len = book.subtitle.length;
}
var len = book && book.subtitle && book.subtitle.length;

/**
 * 6.5
 */

var o = {x:1, y:2, z:3}
var p = {x:4, y:5, v:8}

function extend(o, p) {
  for (prop in p) {
    o[prop] = p[prop]
  }
  return o;
}

function merge(o, p) {
  for (prop in p) {
    // o.hasOwnProperty[prop] 和 o.hasOwnProperty(prop) 结果完全不同
    if (o.hasOwnProperty[prop]) continue
    o[prop] = p[prop]
  }
  return o
}

function restrict(o, p) {
  for (prop in o) {
    if (!(prop in p)) delete o[prop]
  }
  return o
}

function subtract(o, p) {
  for (prop in p) {
    delete o[prop];
  }
  return o
}

function union(o, p) {
  return extend(extend({}, o), p)
}

function intersection(o, p) {
  return restrict(extend({}, o), p)
}

function keys(o) {
  if (typeof o !== "object") throw TypeError();
  var result = [];
  for (var prop in o) {
    if (o.hasOwnProperty(prop)) {
      result.push(prop)
    }
  }
  return result;
}

var q = merge(o, p); // {x: 4, y: 5, z: 3}

/**
 * 6.6
 */

 var p = {
   x: 1.0,
   y: 1.0,
   // r是属性名，是一个属性！！ 可读写的存取器属性，因为get和set
   get r() {
     return Math.sqrt(this.x*this.x + this.y*this.y)
   },
   set r(newvalue) {
     var oldvalue = Math.sqrt(this.x*this.x + this.y*this.y);
     var ratio = newvalue/oldvalue;
     this.x *= ratio;
     this.y *= ratio;
   },
   // theta是个只读的存取器属性，因为它只有getter方法
   get theta() {
     return Math.atan2(this.y, this.x)
   }
 }

 var q = inherit(p);
 q.x = 1, q.y = 1;
 console.log(q.r);
 console.log(q.theta);

 var serialnum = {
   $n: 0,
   get next() {
     return this.$n++
   },
   set next(n) {
     if (n >= this.$n) this.$n = n;
     else throw "序列号的值不能比当前值小"
   }
 }
 serialnum.next = 3;
 serialnum.next = 2; // 报错

 var random = {
   get octet() { return Math.floor(Math.random()*256) },
   get uint16() { return Math.floor(Math.random()*65536) },
   get int16() { return Math.floor(Math.random()*65536) - 32768 }
 }

 /**
  * 6.7
  */
Object.getOwnPropertyDescriptor({x:1}, "x");
Object.getOwnPropertyDescriptor(random, "octet");
Object.getOwnPropertyDescriptor({}, "x");
Object.getOwnPropertyDescriptor({}, "toString");

var o = {};
Object.defineProperty(o, "x", {
  value: 1,
  writable: true,
  enumerable: false,
  configurable: true
})
o.x;
Object.keys(o);
Object.defineProperty(o, "x", {writable: false}); // 变为不可写
o.x = 2; // 报错
Object.defineProperty(o, "x", { value: 2});
Object.defineProperty(o, "x", {get: function() {return 0}})
o.x // 0

Object.defineProperty(Object.prototype,
  "extend",
  {
    writable: true,
    enumerable: false, // 不可枚举
    configurable: true,
    value: function(o) {
      var names = Object.getOwnPropertyNames(o); // 得到所以 自有属性的key
      for (var i = 0; i < names.length; i++) {
        // 如果原对象已经存在这个属性，就跳过
        if (names[i] in this) continue
        var desc = Object.getOwnPropertyDescriptor(o, names[i]);
        Object.defineProperty(this, names[i], desc)
      }
    }
  });

/**
 * 6.8.2 对象的 类 属性
 */
function classof(o) {
  if (o === null) return "Null";
  if (o === undefined) return "Undefined";
  return Object.prototype.toString.call(o).slice(8, -1);
}