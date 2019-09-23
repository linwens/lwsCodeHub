/**
 * 11.2
 */
function oddsums(n) {
  let total = 0, result = [];
  for(let x = 1; x <= n; x++) {
    let odd = 2*x-1;
    total += odd;
    result.push(total);
  }
  return result;
}
oddsums(5)
 
o = {x: 1, y: 2};
for(let p in o) {
  console.log(p);
}
// for each (let v in o) console.log(v)
/* 
let x = 1;
for(let x = 1; x < 5; x++)
  console.log(x)
{
  let x = x + 1;
  console.log(x);
}

let x=1, y=2;
let (x = x + 1, y = x + 2) {
  console.log(x + y)
};
console.log(x+y);

let x = 1, y = 2;
console.log(let (x = x + 1, y = x + 2) x+y );
 */

 /**
  * 11.3
  */
/* let [x, y] = [1, 2];
[x, y] = [x+1, y+1];
[x, y] = [y, x];
console.log([x, y]);

function polar(x, y) {
  return [Math.sqrt(x*x + y*y), Math.atan2(y, x)];
}

function cartesian(r, theta) {
  return [r*Math.cos(theta), r*Math.sin(theta)];
}

let [r, theta] = polar(1.0, 1.0);
let [x, y] = cartesian(r, theta); */

let [x, y] = [1];
[x, y] = [1,2,3];
[,x,,y] = [1,2,3,4];

let first, second, all;
all = [first, second] = [1, 2, 3, 4];

let [one, [twoA, twoB]] = [1, [2, 2.5], 3];

let transparent = {r: 0.0, g: 0.0, b: 0.0, a: 1.0};
let {r: red, g: green, b:blue} = transparent;

let {sin: sin, cos: cos, tan: tan} = Math;
console.log(sin);

let data = {
  name: 'destructuring assignment',
  type: "extension",
  impl: [
    {engine: "spidermonkey", version: 1.7},
    {engine: "rhino", version: 1.7},
  ]
}

let {name: feature, impl: [{engine: impl1, version: v1}, {engine: impl2}]} = data;
console.log(feature);
console.log(impl1);
console.log(v1);
console.log(impl2);

/**
 * 11.4 迭代器，生成器...基本有点蒙.....
 */

/**
 * 11.4.2
 */

function counter(start) {
  let nextValue = Math.round(start);
  return {
    next: function() {
      return nextValue++
    }
  }
}
let serialNumberGenerator = counter(1000);
let sn1 = serialNumberGenerator.next();
let sn2 = serialNumberGenerator.next();

function rangeIter(first, last) {
  let nextValue = Math.ceil(first);
  return {
    next: function() {
      if (nextValue > last) {
        throw StopIteration;
      }
      return nextValue++;
    }
  }
}

let r = rangeIter(1, 5);
while(true) {
  try {
    console.log(r.next())
  } catch(e) {
    if (e == StopIteration) {
      break
    } else {
      throw e;
    }
  }
}

function range(min, max) {
  return {
    get min() {return min;},
    get max() {return max;},
    includes: function(x) {
      return min <= x && x <= max;
    },
    toString: function() {
      return "[" + min + "," + max + "]"
    },
    __iterator__: function() {
      let val = Math.ceil(min);
      return {
        next: function() {
          if (val > max) {
            throw StopIteration;
          }
          return val++;
        }
      }
    }
  }
}
/* for (let i in range(1, 100)) {
  console.log(i);
} */

for(let [k, v] in Iterator({a:1, b:2})) {
  console.log(k + "=" + v);
}

let oo = {x:1, y:2};
Object.prototype.z = 3;
for(p in oo) {
  console.log(p)
}
for(p in Iterator(oo, true)) {
  console.log(p);
}

/**
 * 11.4.3
 */
function range(min, max) {
  for (let i = Math.ceil(min); i <= max; i++) {
    yield i;
  }
}
for (let n in range(3, 8)) {
  console.log(n);
}
function fibonacci() {
  let x = 0, y = 1;
  while(true) {
    yield y;
    [x, y] = [y, x+y];
  }
}
f = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(f.next());
}
f.close();

function eachline(s) {
  let p;
  while((p = s.indexOf('\n')) != -1) {
    yield s.substring(0, p);
    s = s.substring(p+1);
  }
  if (s.length > 0) yield s;
}

function map(i, f) {
  for (let x in i) {
    yield f(x);
  }
}
function select(i, f) {
  for(let x in i) {
    if (f(x)) yield x;
  }
}

let text = " #comment \n \n hello \nworld\n quit \n unreached \n";

let lines = eachline(text);
let trimmed = map(lines, function(line) {
  return line.trim();
})

let nonblank = select(trimmed, function(line) {
  return line.length > 0 && line[0] != "#"
});

for (let line in nonblank) {
  if (line === "quit") break;
  console.log(line);
}

function counter(initial) {
  let nextValue = initial;
  while(true) {
    try {
      let increment = yield nextValue;
      if (increment) {
        nextValue += increment;
      } else {
        nextValue++
      }
    } catch(e) {
      if (e === "reset") {
        nextValue = initial;
      } else {
        throw e;
      }
    }
  }
}

let c = counter(10);
console.log(c.next());
console.log(c.send(2));
console.log(c.throw("reset"));

/**
 * 11.4.4
 */
let evensquares = [x*x for (x in range(0, 10)) if (x % 2 === 0)];
// =====等同于======
let evensquares = [];
for (x in range(0, 10)) {
  if (x % 2 === 0) {
    evensquares.push(x*x);
  }
}

data = [2, 3, 4, -5];
squares = [x*x for each (x in data)];
roots = [Math.sqrt(x) for each (x in data) if (x >= 0)];

o = {a:1, b:2, f: function(){}};
let allkeys = [p for (p in o)];
let ownkeys = [p for (p in o) if (o.hasOwnProperty(p))];
let notfuncs = [k for ([k, v] in Iterator(o)) if (typeof v !== "function")];

/**
 * 11.4.5
 */
let h = (f(x) for(x in g));

let lines = eachline(text);
let trimmed = (l.trim() for(l in lines));
let nonblank = (l for (l in trimmed) if (l.length > 0 && l[0] != '#'));

/**
 * 11.7
 */
