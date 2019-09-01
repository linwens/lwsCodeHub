// DocumentFragment类在实际文档中并不存在的一种节点;它代表一系列没有常规父节点的节点
/**
 * 15.2.1
 */
 
function getElements(/*ids...*/) {
  var elements = {};
  for(var i = 0; i < arguments.length; i++) {
    var id = arguments[i];
    var elt = document.getElementById(id);
    if (elt == null) {
      throw new Error("No element width id: " + id);
    }
    elements[id] = elt;
  }
  return elements;
}

/**
 * 15.2.4
 */
var warnings = document.getElementsByClassName("warning");

var log = document.getElementById("log");
var fatal = log.getElementsByClassName("fatal error");

/**
 * 15.3.2
 */
//------------|  e.nodeType === 1 代表是element节点
/**
 * 返回元素e的第n层祖先元素，如果不存在或者祖先不是Element就返回null
 * 如果n为0，则返回e本身。n为1则返回其父元素，以此类推。
 * @param {*} e 
 * @param {*} n 
 */
function parent(e, n) {
  if (n === undefined) n = 1;
  while(n-- && e) e = e.parentNode; // e参数存在，就层层遍历父元素，并赋值给 e
  if (!e || e.nodeType !== 1) return null
  return e;
}

/**
 * 返回元素e的 第n个 兄弟元素，n>0 查找后面的兄弟元素；n<0 查找前面的兄弟元素
 * @param {*} e 
 * @param {*} n 
 */
function sibling(e, n) {
  while(e && n !== 0) {
    if(n > 0) {
      if (e.nextElementSibling) e = e.nextElementSibling;
      else {
        for (e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling) {
          // 空循环
        }
      }
      n--
    } else {
      if (e.previousElementSibling) e = e.previousElementSibling;
      else {
        for (e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling) {
          // 空循环
        }
      }
    }
  }
  return e;
}

/**
 * 返回元素e的第n个子元素，如果不存在则为null
 * @param {*} e 
 * @param {*} n 
 */
function child(e, n) {
  if (e.children) {
    if (n < 0) n += e.children.length;
    if (n < 0) return null;
    return e.children[n];
  }
  // e不存在children数组
  if (n >= 0) {
    if (e.firstElementChild) e = e.firstElementChild;
    else {
      for (e = e.firstChild; e && e.nodeType !== 1; e = e.nextSibling) {}
    }
    return sibling(e, n)
  } else {
    if (e.lastElementChild) e = e.lastElementChild;
    else {
      for (e = e.lastChild; e && e.nodeType !== 1; e = e.previousSibling) {}
    }
    return sibling(e, n+1)
  }
}

// 自定义element的方法
Element.prototype.next = function() {
  if (this.nextElementSibling) return this.nextElementSibling;
  var sib = this.nextSibling;
  while(sib && sib.nodeType !== 1) sib = sib.nextSibling;
  return sib;
}
if (!document.documentElement.children) {
  Element.prototype.__defineGetter__("children", function() {
    var kids = [];
    for (var c = this.firstChild; c != null; c = c.nextSibling) {
      if(c.nodeType === 1) kids.push(c);
    }
    return kids;
  })
}

/**
 * 15.4.3
 */
var sparklines = document.getElementsByClassName("sparkline");
for (var i = 0; i < sparklines.length; i++) {
  var elt = sparklines[i];
  if (sparklines[i].dataset) {
    var dataset = sparklines[i].dataset;
    var ymin = parseFloat(dataset.ymin);
    var ymax = parseFloat(dataset.ymax);
  } else {
    var ymin = parseFloat(elt.getAttribute("data-ymin"));
    var ymax = parseFloat(elt.getAttribute("data-ymax"));
    var points = elt.getAttribute("data-points");
  }
  var data = elt.textContent.split(" ").map(parseFloat);
  // 以下方法未实现
  // drawSparkline(sparklines[i], ymin, ymax, data);
}

/**
 * 15.4.4
 */
