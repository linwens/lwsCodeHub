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
if (book) {
  if (book.subtitle) len = book.subtitle.length;
}
var len = book && book.subtitle && book.subtitle.length;

/**
 * 6.3
 */
