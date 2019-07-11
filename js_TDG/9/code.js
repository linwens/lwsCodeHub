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
  // 正则的解释：match()[1]拿到的是子表达式([^(]*)里的东西，这个pattern指的是 非( 的任意多个值, 即函数名
  return this.name || this.toString().match(/function\s*([^(]*)\(/)[1];
}

/**
 * 9.5.3
 */
function type(o) {
  var t, c, n; // type, class, name
  if (0 === null) return 'null';
  if (o !== o) return "nan";
  if ((t = typeof o) !== "object") return t;
  if ((c = classof(o)) !== "Object") return c;
  if (o.constructor && typeof o.constructor === "function" && (n = o.constructor.getName())) return n;
  return "Object";
}
function classof(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}

/**
 * 9.5.4
 */
function quacks(o /*, ... */) {
  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];
    switch (typeof arg) {
      case 'string': 
        if (typeof o[arg] !== "function") return false;
        continue;
      case 'function':
        arg = arg.prototype;
      case 'object':
        for (var m in arg) {
          if (typeof arg[m] !== "function") continue;
          if (typeof o[m] !== "function") return false;
        }
    }
  }
  return true
}

/**
 * 9.6.1 集合类
 */
function Set() {
  this.values = {};
  this.n = 0;
  this.add.apply(this, arguments);
}

Set.prototype.add = function() {
  for (var i = 0; i < arguments.length; i++) {
    var val = arguments[i];
    var str = Set.v2s(val);
    if (!this.values.hasOwnProperty(str)) {
      this.values[str] = val;
      this.n++;
    }
  }
  return this;
}
Set.prototype.remove = function() {
  for (var i = 0; i < arguments.length; i++) {
    var str = Set._v2s(arguments[i]);
    if (this.values.hasOwnProperty(str)) {
      delete this.values[str];
      this.n--;
    }
  }
  return this;
}
Set.prototype.contains = function(value) {
  return this.values.hasOwnProperty(Set._v2s(value));
}
Set.prototype.size = function() {
  return this.n;
}
Set.prototype.foreach = function(f, context) {
  for (var s in this.values) {
    if (this.values.hasOwnProperty(s)) {
      f.call(context, this.values[s])
    }
  }
}
Set._v2s = function(val) {
  switch (val) {
    case undefined: return 'u';
    case null:      return 'n';
    case true:      return 't';
    case false:     return 'f';
    default: switch (typeof val) {
      case 'number': return '#' + val;
      case 'string': return '"' + val;
      default: return '@' + objectId(val)
    }
  }
  function objectId(o) {
    var prop = "|**objectid**|";
    if (!o.hasOwnProperty(prop)) {
      o[prop] = Set._v2s.next++;
    }
    return o[prop];
  }
}
Set._v2s.next = 100; // 设置初始id值
/**
 * 9.6.2
 */
function enumeration(namesToValues) {
  var enumeration = function (){
    throw "Can't Instantiate Enumerations";
  }
  var proto = enumeration.prototype = {
    constructor: enumeration,
    toString: function() {return this.name;},
    valueOf: function() {return this.value;},
    toJSON: function() {return this.name}
  };
  enumeration.values = [];
  for (name in namesToValues) {
    var e = inherit(proto);
    e.name = name;
    e.value = namesToValues[name];
    enumeration[name] = e;
    enumeration.values.push(e);
  }
  enumeration.foreach = function(f, c) {
    for (var i = 0; i < this.values.length; i++) {
      f.call(c, this.values[i]);
    }
  };
  return enumeration;
}

// 扑克牌
function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
}

Card.Suit = enumeration({Clubs: 1, Diamond: 2, Hearts: 3, Spades: 4});
Card.Rank = enumeration({Two: 2, Three: 3, Four: 4, Five: 5, Six: 6,Seven: 7, Eight: 8, Nine: 9, Ten: 10, Jack: 11, Queen: 12, King: 13, Ace: 14});

Card.prototype.toString = function() {
  return this.rank.toString() + " of" + this.suit.toString();
}
Card.prototype.compareTo = function(that) {
  if (this.rank < that.rank) return -1;
  if (this.rank > that.rank) return 1;
  return 0;
};
Card.orderByRank = function(a, b) { return a.compareTo(b);}
Card.orderBySuit = function(a, b) {
  if (a.suit < b.suit) return -1;
  if (a.suit > b.suit) return 1;
  if (a.rank < b.rank) return -1;
  if (a.rank > b.rank) return 1;
  return 0;
}
function Deck() {
  var cards = this.cards = [];
  Card.Suit.foreach(function(s) {
    Card.Rank.foreach(function(r) {
      cards.push(new Card(s, r))
    })
  })
}
Deck.prototype.shuffle = function() {
  var deck = this.cards, len = deck.length;
  for (var i = len -1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1)), temp;
    temp = deck[i], deck[i] = deck[r], deck[r] = temp;
  }
  return this;
}
Deck.prototype.deal = function(n) {
  if (this.cards.length < n) throw "Out of cards";
  return this.cards.splice(this.cards.length - n, n);
}
var deck = (new Deck()).shuffle();
var hand = deck.deal(13).sort(Card.orderBySuit);

/**
 * 9.6.3
 */