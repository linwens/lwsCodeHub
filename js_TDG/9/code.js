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
    var str = Set._v2s(val);
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
extend(Set.prototype, {
  toString: function() {
    var s = "{",
    i = 0;
    this.foreach(function(v) {
      s += ((i++ > 0) ? ", " : "") + v;
    })
    return s + "}";
  },
  toLocaleString: function() {
    var s = "{". i = 0;
    this.foreach(function(v) {
      if (i++ > 0) s += ", ";
      if (v == null) s += v;
      else s += v.toLocaleString();
    });
    return s + "}";
  },
  toArray: function() {
    var a = [];
    this.foreach(function(v) {
      a.push(v);
    })
    return a;
  }
})
Set.prototype.toJSON = Set.prototype.toArray;

/**
 * 9.6.4
 */
Range.prototype.constructor = Range;
Range.prototype.equals = function(that) {
  if (that == null) return false;
  if (that.constructor !== Range) return false;
  return this.from == that.from && this.to == that.to;
}

Set.prototype.equals = function (that) {
  if (this === that) return true;
  if (!(that instanceof Set)) return false;
  if (this.size() != that.size()) return false;
  try{
    this.foreach(function(v) {
      if (!that.contains(v)) throw false; // 通过抛出异常来中止foreach循环
    })
    return true;
  } catch(x) {
    if (x === false) return false;
    throw x
  }
}

/**
 * 9.6.5
 */
var generic = {
  toString: function() {
    var s = '[';
    if (this.constructor && this.constructor.name) {
      s += this.constructor.name + ": ";
    }
    var n = 0;
    for (var name in this) {
      if (!this.hasOwnProperty(name)) continue;
      var value = this[name];
      if (typeof value === "function") continue;
      if (n++) s += ", ";
      s += name + '=' + value;
    }
    return s + ']';
  },
  equals: function(that) {
    if (that == null) return false;
    if (this.constructor !== that.constructor) return false;
    for (var name in this) {
      if (name === "|**objectid**|") continue;
      if (!this.hasOwnProperty(name)) continue;
      if (this[name] !== that[name]) return false;
    }
    return true;
  }
}

/**
 * 9.6.6
 */
function Range(from, to) {
  this.from = function() {return from};
  this.to = function() {return to};
}
Range.prototype = {
  constructor: Range,
  includes: function(x) {
    return this.from() <= x && x <= this.to();
  },
  foreach: function(f) {
    for (var x = Math.ceil(this.from(), max = this.to()); x <= max; x++) {
      f(x)
    }
  },
  toString: function() {
    return "(" + this.from() + "..." + this.to() + ")"
  }
}

var r = new Range(1, 5);
// r.from = function() {return 0};

/**
 * 9.6.7
 */
function Set() {
  this.values = {};
  this.n = 0;

  if (arguments.length == 1 && isArrayLike(arguments[0])) {
    this.add.apply(this, arguments[0])
  } else if (arguments.length > 0) {
    this.add.apply(this, arguments);
  }
}

Complex.polar = function(r, theta) {
  return new Complex(r*Math.cos(theta), r*Math.sin(theta));
}
Set.fromArray = function(a) {
  s = new Set();
  s.add.apply(s, a);
  return s;
}
function SetFromArray(a) {
  Set.apply(this, a);
}
SetFromArray.prototype = Set.prototype;

var s = new SetFromArray([1,2,3]);
s instanceof Set; // true

/**
 * 9.7.1
 */
function defineSubclass(superclass, // 父类的构造函数
                        constructor, // 新子类的构造函数
                        methods, // 实例方法， 复制到原型
                        statics) // 类属性， 复制到构造函数
{
  constructor.prototype = inherit(superclass.prototype);
  constructor.prototype.constructor = constructor;
  if (methods) extend(constructor.prototype, methods);
  if (statics) extend(constructor, statics);
  return constructor;
}
Function.prototype.extend = function(constructor, methods, statics) {
  return defineSubclass(this, constructor, methods, statics);
}

// 构造函数
function SingletonSet(member) {
  this.member = member;
}
SingletonSet.prototype = inherit(Set.prototype);
extend(SingletonSet.prototype, {
  constructor: SingletonSet,
  add: function() { throw "read-only set";},
  remove: function() { throw "read-only set";},
  size: function() {return 1;},
  foreach: function(f, context) {
    f.call(context, this.member);
  },
  contains: function(x) {
    return x === this.member;
  }
})
SingletonSet.prototype.equals = function(that) {
  return that instanceof Set && that.size()==1 && that.contains(this.member);
}

/**
 * 9.7.2
 */
// 在子类中调用父类的构造函数和方法
function NonNullSet() {
  Set.apply(this, arguments);
}
NonNullSet.prototype = inherit(Set.prototype);
NonNullSet.prototype.constructor = NonNullSet;

NonNullSet.prototype.add = function() {
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] == null) {
      throw new Error("Can't add null or undefined to a NonNullSet");
    }
  }
  return Set.prototype.add.apply(this, arguments)
}

// 类工厂和方法链
function filteredSubclass(superclass, filter) {
  var constructor = function() {
    superclass.apply(this, arguments)
  }
  var proto = constructor.prototype = inherit(superclass.prototype);
  proto.constructor = constructor;
  proto.add = function() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (!filter(v)) throw ("Value " + v + " rejected by filter");
    }
    superclass.prototype.add.apply(this, arguments);
  }
  return constructor;
}

var StringSet = filteredSubclass(Set, function(x) { return typeof x === "string"});
var MySet = filteredSubclass(NonNullSet, function(x) {return typeof x !== "function"});

var NonNullSet = (function() {
  var superclass = Set;
  return superclass.extend(function() {superclass.apply(this, arguments)}, 
  {
    add: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] == null) {
          throw new Error("Can't add null or undefined");
        }
      }
      return superclass.prototype.add.apply(this, arguments)
    }
  })
}());

/**
 * 9.7.3
 */
var FilteredSet = Set.extend(function FilteredSet(set, filter) {
  this.set = set;
  this.filter = filter;
}, {
  add: function() {
    if (this.filter) {
      for (var i = 0; i < arguments.length; i++) {
        var v = arguments[i];
        if (!this.filter(v)) {
          throw new Error("FilteredSet: value " + v +" rejected by filter");
        }
      }
    }
    this.set.add.apply(this.set, arguments);
    return this;
  },
  remove: function() {
    this.set.remove.apply(this.set, arguments);
    return this;
  },
  contains: function(v) {
    return this.set.contains(v);
  },
  size: function() {
    return this.set.size();
  },
  foreach: function(f, c) {
    this.set.foreach(f, c)
  }
});
var s = new FilteredSet(new Set(), function(x) {
  return x !== null;
})
var t = new FilteredSet(s, {
  function (x) {
    return !(x instanceof Set);
  }
});

/**
 * 9.7.4
 */
function abstractmethod() {
  throw new Error("abstract method")
}
function AbstractSet() {
  throw new Error("Can't instantiate abstract classes")
}
AbstractSet.prototype.contains = abstractmethod;

var NotSet = AbstractSet.extend(function NotSet(set) {
  this.set = set;
}, {
  contains: function (x) { return !this.set.contains(x);},
  toString: function (x) { return "~" + this.set.toString();},
  equals: function (that) {
    return that instanceof NotSet && this.set.equals(that.set);
  }
});

var AbstractEnumerableSet = AbstractSet.extend(function() {
  throw new Error("Can't instantiate abstract classes")
}, {
  size: abstractmethod,
  foreach: abstractmethod,
  isEmpty: function() {return this.size() == 0},
  toString: function() {
    var s = "{", i = 0;
    this.foreach(function(v) {
      if (i++>0) s += ", ";
      s += v
    });
    return s + "}"
  },
  toLocaleString: function() {
    var s = "{", i = 0;
    this.foreach(function(v) {
      if (i++>0) s += ", ";
      if (v == null) s += v;
      else s += v.toLocaleString();
    })
    return s + "}";
  },
  toArray: function() {
    var a = [];
    this.foreach(function(v) {
      a.push(v)
    });
    return a;
  },
  equals: function(that) {
    if (!(that instanceof AbstractEnumerableSet)) return false;
    if (this.size() != that.size()) return false;
    try {
      this.foreach(function(v) {
        if (!that.contains(v)) throw false;
      });
      return true;
    } catch(x) {
      if (x === false) return false;
      throw x;
    }
  }
});

var SingletonSet = AbstractEnumerableSet.extend(function SingletonSet(member) {
  this.member = member;
}, {
  contains: function(x) {
    return x === this.member;
  },
  size: function() { return 1;},
  foreach: function(f, ctx) {
    f.call(ctx, this.member)
  }
});

var AbstractWritableSet = AbstractEnumerableSet.extend(function() {
  throw new Error("Can't instantiate abstract classes")
}, {
  add: abstractmethod,
  remove: abstractmethod,
  union: function(that) {
    var self = this;
    that.foreach(function(v) {
      self.add(v)
    });
    return this;
  },
  intersection: function(that) {
    var self = this;
    this.foreach(function(v) {if (!that.contains(v)) self.remove(v)});
    return this;
  },
  difference: function(that) {
    var self = this;
    that.foreach(function(v) { self.remove(v)});
    return this;
  }
});

var ArraySet = AbstractEnumerableSet.extend(function ArraySet() {
  this.values = [];
  this.add.apply(this, arguments);
}, {
  contains: function(v) { return this.values.indexOf(v) != -1},
  size: function() {return this.values.length;},
  foreach: function(f, c) { this.values.forEach(f, c);},
  add: function() {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (!this.contains(arg)) this.values.push(arg);
    }
    return this;
  },
  remove: function() {
    for (var i = 0; i < arguments.length; i++) {
      var p = this.values.indexOf(arguments[i]);
      if (p == -1) continue;
      this.values.splice(p, 1);
    }
    return this;
  }
});
/**
 * 9.8.1
 */
(function() {
  Object.defineProperty(Object.prototype, "objectId", {
    get: idGetter,
    enumerable: false,
    configurable: false
  });
  function idGetter() {
    if (!(idprop in this)) {
      if (!Object.isExtensible(this)) {
        throw Error("Can't define id for nonextensible objects");
      }
      Object.defineProperty(this, idprop, {
        value: nextid++,
        writable: false,
        enumerable: false,
        configurable: false
      });
      return this[idprop];
    };
    var idprop = "|**objectId**|";
    var nextid = 1;
  }
} ())

/**
 * 9.8.2
 */
function Range(from, to) {
  var props = {
    from: {
      value: from,
      enumerable: true,
      writable: false,
      configurable: false
    },
    to: {
      value: to,
      enumerable: true,
      writable: false,
      configurable: false
    }
  };
  if (this instanceof Range) {
    Object.defineProperties(this, props);
  } else {
    return Object.create(Range.prototype, props);
  }
}
Object.defineProperties(Range.prototype, {
  includes: {
    value: function(x) {
      return this.from <= x && x <= this.to
    }
  },
  foreach: {
    value: function(f) {
      for (var x = Math.ceil(this.from); x <= this.to; x++) {
        f(x)
      }
    }
  },
  toString: {
    value: function() {
      return "(" + this.from + "..." + this.to + ")"
    }
  }
});

function freezeProps(o) {
  var props = (arguments.length == 1) ? Object.getOwnPropertyNames(o) : Array.prototype.splice.call(arguments, 1);
  props.forEach(function(n) {
    if (!Object.getOwnPropertyDescriptor(o, n).configurable) return;
    Object.defineProperty(o, n, {
      writable: false,
      configurable: false
    });
  })
  return o;
}
function hideProps(o) {
  var props = (arguments.length == 1) ? Object.getOwnPropertyNames(o) : Array.prototype.splice.call(arguments, 1);
  props.forEach(function(n) {
    if (!Object.getOwnPropertyDescriptor(o, n).configurable) return;
    Object.defineProperty(o, n, {
      enumerable: false
    })
  })
  return o;
}

function Range(from, to) {
  this.from = from;
  this.to = to;
  freezeProps(this);
}

Range.prototype = hideProps({
  constructor: Range,
  includes: function(x) {
    return this.from <= x && x <= this.to
  },
  foreach: function(f) {
    for(var x = Math.ceil(this.from); x <= this.to; x++) {
      f(x)
    }
  },
  toString: function() {
    return "(" + this.from + "..." + this.to + ")"
  }
})

/**
 * 9.8.3
 */
function Range(from, to) {
  if (from > to) throw new Error("Range: from must be <= to");

  function getFrom() { return from }
  function getTo() { return to }
  function setFrom(f) {
    if (f <= to) from = f;
    else throw new Error("Range: from must be <= to");
  }
  function setTo(t) {
    if (t >= from) to = t;
    else throw new Error("Range: to must be >= from");
  }
  Object.defineProperties(this, {
    from: {
      get:getFrom,
      set: setFrom,
      enumerable: true,
      configurable: false
    },
    to: {
      get: getTo,
      set: setTo,
      enumerable: true,
      configurable: false
    }
  })
}

Range.prototype = hideProps({
  constructor: Range,
  includes: function(x) {
    return this.from <= x && x <= this.to
  },
  foreach: function(f) {
    for (var x = Math.ceil(this.from); x <= this.to; x++) {
      f(x)
    }
  },
  toString: function() {
    return "(" + this.from + "..." + this.to + ")"
  }
});

var original_sort_method = Array.prototype.sort;
Array.prototype.sort = function() {
  var start = new Date();
  original_sort_method.apply(this, arguments);
  var end = new Date();
  console.log("Array sort took" + (end - start) + " milliseconds.")
}

/**
 * 9.8.5
 */
function StringSet() {
  this.set = Object.create(null); // 创建一个不包含原型的对象
  this.n = 0;
  this.add.apply(this, arguments);
}
StringSet.prototype = Object.create(AbstractWritableSet.prototype, {
  constructor: { value: StringSet },
  contains: {
    value: function(x) {
      return x in this.set;
    }
  },
  size: {
    value: function(x) {
      return this.n
    }
  },
  foreach: {
    value: function(f, c) {
      Object.keys(this.set).forEach(f, c); // c 参数用于指定this值
    }
  },
  add: {
    value: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!(arguments[i] in this.set)) {
          this.set[arguments[i]] = true;
          this.n++;
        }
      }
      return this;
    }
  },
  remove: {
    value: function() {
      for (var i = 0; i <arguments.length; i++) {
        if (arguments[i] in this.set) {
          delete this.set[arguments[i]];
          this.n--
        }
      }
      return this;
    }
  }
});

/**
 * 9.8.6
 */
(function namespace() {
  function properties() {
    var names;
    if (arguments.length == 0) {
      names = Object.getOwnPropertyNames(this);
    } else if (arguments.length == 1 && Array.isArray(arguments[0])) {
      names = arguments[0]
    } else {
      names = Array.prototype.splice.call(arguments, 0)
    }
    return new Properties(this, names);
  }

  Object.defineProperty(Object.prototype, "properties", {
    value: properties,
    enumerable: false,
    writable: true,
    configurable: true
  });

  function Properties(o, names) {
    this.o = o;
    this.names = names;
  }

  Properties.prototype.hide = function() {
    var o = this.o, hidden = {enumerable: false};
    this.names.forEach(function(n) {
      if (o.hasOwnProperty(n)) {
        Object.defineProperty(o, n, hidden)
      }
    })
    return this;
  }

  Properties.prototype.freeze = function() {
    var o = this.o, frozen = { writable: false, configurable: false};
    this.names.forEach(function(n) {
      if (o.hasOwnProperty(n)) {
        Object.defineProperty(o, n, frozen)
      }
    })
    return this;
  }

  Properties.prototype.descriptors = function() {
    var o = this.o, desc = {};
    this.names.forEach(function(n) {
      if (!o.hasOwnProperty(n)) return;
      desc[n] = Object.getOwnPropertyDescriptor(o, n);
    })
    return desc;
  }

  Properties.prototype.toString = function() {
    var o = this.o;
    var lines = this.names.map(nameToString);
    return "{\n " + lines.join(",\n ") + "\n}";

    function nameToString(n) {
      var s = "", desc = Object.getOwnPropertyDescriptor(o, n);
      if (!desc) return "nonexistent " + n + ": undefined";
      if (!desc.configurable) s += "permanent ";
      if ((desc.get && !desc.set) || !desc.writable) s += "readonly ";
      if (!desc.get || desc.set) s += "accessor " + n
      else s += n + ": " + ((typeof desc.value === "function") ? "function" : desc.value);
      return s 
    }
  }
  // 调用刚增加的方法
  Properties.prototype.properties().hide();
} ())

/**
 * 9.9.2
 */
var Set = (function invocation() {
  function Set() {
    this.values = {};
    this.n = 0;
    this.add.apply(this, arguments);
  }

  Set.prototype.contains = function(value) {
    return this.values.hasOwnProperty(v2s(value));
  }
  Set.prototype.size = function() { return this.n}
  Set.prototype.add = function() {}
  Set.prototype.remove = function() {
    Set.prototype.foreach = function(f, c) {}
  }
  function v2s(val) {}
  function objectId(o) {}
  var nextId = 1;
  return Set;
} ())

// 引入模块, 方法1
var collections;
if (!collections) collections = {};
collections.sets = (function namespace() {
  /** 省略代码，下面示例为了不报错 */
  var AbstractSet = null;
  var NotSet = null;

  return {
    AbstractSet: AbstractSet,
    NotSet: NotSet
    //...
  }
} ())

// 引入模块, 方法2
var collections;
if (!collections) collections = {};
collections.sets = (new function namespace() {
  /** 省略代码，下面示例为了不报错 */
  var AbstractSet = null;
  var NotSet = null;

  this.AbstractSet = AbstractSet;
  this.NotSet = NotSet;
  //...
}())

// 引入模块, 方法3
var collections;
if (!collections) collections = {};
collections.sets = {};
(function namespace() {
  /** 省略代码，下面示例为了不报错 */
  var AbstractSet = null;
  var NotSet = null;

  collections.sets.AbstractSet = AbstractSet;
  collections.sets.NotSet = NotSet;
  //...
} ())
