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
//------------|  e.nodeType === 1 代表是element节点  | e.nodeType === 3 代表是Text节点  | e.nodeType === 4 代表是	CDATASection (不会由解析器解析的文本)
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
document.body.attributes[0]
document.body.attributes.bgcolor
document.body.attributes["ONLOAD"]

/**
 * 15.5.2
 */
var para = document.getElementsByTagName("p")[0];
var text = para.textContent;
para.textContent = "Hello World!";

function textContent(element, value) {
  var content = element.textContent;
  if (value === undefined) {
    if (content !== undefined) {
      return content;
    } else {
      return element.innerText
    }
  } else {
    if (content !== undefined) {
      element.textContent = value
    } else {
      element.innerText = value;
    }
  }
}

/**
 * 15.5.3
 */
function textContent(e) {
  var child, type, s = "";
  for(child = e.firstChild; child != null; child = child.nextSibling) {
    type = child.nodeType;
    if (type === 3 || type ===4) {
      s += child.nodeValue;
    } else if (type === 1) {
      s += textContent(child);
    }
  }
  return s;
}

function upcase(n) {
  if (n.nodeType == 3 || n.nodeType == 4) {
    n.data = n.data.toUpperCase();
  } else {
    for(var i = 0; i < n.childNodes.length; i++) {
      upcase(n.childNodes[i]);
    }
  }
}

/**
 * 15.6
 */
function loadasync(url) {
  var head = document.getElementsByTagName("head")[0];
  var s = document.createElement("script");
  s.src = url;
  head.appendChild(s);
}

/**
 * 15.6.2
 */
function insertAt(parent, child, n) {
  if (n < 0 || n > parent.childNodes.length) {
    throw new Error("invalid index");
  } else if (n == parent.childNodes.length) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, parent.childNodes[n]);
  }
}

function sortrows(table, n, comparator) { // comparator可以自定义排序规则
  var tbody = table.tBodies[0];
  var rows = tbody.getElementsByTagName("tr");
  rows = Array.prototype.slice.call(rows, 0);

  rows.sort(function(row1, row2) {
    var cell1 = row1.getElementsByTagName('td')[0];
    var cell2 = row2.getElementsByTagName('td')[0];
    var val1 = cell1.textContent || cell1.innerText;
    var val2 = cell2.textContent || cell2.innerText;
    // 如果存在comparator函数就用它进行比较，否则按字母表顺序比较
    if (comparator) return comparator(val1, val2)
    if (val1 < val2) {
      return -1
    } else if (val1 < val2) {
      return 1
    } else {
      0
    }
  })
  for(var i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i])
  }
}
// 单击表头对该列进行排序
function makeSortable(table) {
  var headers = table.getElementsByTagName('th');
  for(var i = 0; i < headers.length; i++) {
    (function(n){
      headers[i].onclick = function() {
        sortrows(table, n)
      }
    }(i))
  }
}

/**
 * 15.6.3
 */
function embolden(n) {
  if (typeof n == "string") {
    n = document.getElementById(n);
  }

  var parent = n.parentNode;
  var b = document.createElement("b");
  parent.replaceChild(b, n);
  b.appendChild(n);
}

(function(){
  if (document.createElement("div").outerHTML) return;

  function outerHTMLGetter() {
    var container = document.createElement("div");
    container.appendChild(this.cloneNode(true));
    return container.innerHTML
  }
  // 当设置元素的outerHTML时，元素本身被新的内容所替换
  function outerHTMLSetter(value) {
    var container = document.createElement("div");
    container.innerHTML = value;
    while(container.firstChild) {
      this.parentNode.insertBefore(container.firstChild, this);
    }
    this.parentNode.removeChild(this);
  }

  if (Object.defineProperty) {
    Object.defineProperty(Element.prototype, "outerHTML", {
      get: outerHTMLGetter,
      set: outerHTMLSetter,
      enumerable: false,
      configurable: true
    });
  } else {
    Element.prototype.__defineGetter__("outerHTML", outerHTMLGetter);
    Element.prototype.__defineSetter__("outerHTML", outerHTMLSetter);
  }
}())

/**
 * 15.6.4
 */
function reverse(n) { // 倒序子节点
  var f = document.createDocumentFragment();
  // 给f添加节点，该节点会自动从n中删除
  while(n.lastChild) f.appendChild(n.lastChild);

  n.appendChild(f);
}

var Insert = (function() {
  if (document.createElement("div").insertAdjacentHTML) {
    return {
      before: function(e, h) { e.insertAdjacentHTML("beforebegin", h)},
      after: function(e, h) { e.insertAdjacentHTML("afterend", h)},
      atStart: function(e, h) { e.insertAdjacentHTML("afterbegin", h)},
      atEnd: function(e, h) { e.insertAdjacentHTML("beforeend", h)}
    };
  }
  // 工具函数
  function fragment(html) {
    var elt = document.createElement("div");
    var frag = document.createDocumentFragment();
    elt.innerHTML = html;
    while(elt.firstChild) {
      frag.appendChild(elt.firstChild)
    }
    return frag;
  }

  var Insert = {
    before: function(elt, html) {
      elt.parentNode.insertBefore(fragment(html), elt);
    },
    after: function(elt, html) {
      elt.parentNode.insertBefore(fragment(html), elt.nextSibling);
    },
    atStart: function(elt, html) {
      elt.insertBefore(fragment(html), elt.firstChild);
    },
    atEnd: function(elt, html) {
      elt.appendChild(fragment(html));
    }
  };

  Element.prototype.insertAdjacentHTML = function(pos, html) {
    switch(pos.toLowerCase()) {
      case "beforebegin": return Insert.before(this, html);
      case "afterend": return Insert.after(this, html);
      case "afterbegin": return Insert.atStart(this, html);
      case "beforeend": return Insert.atEnd(this, html);
    }
  }
  return Insert;
}())

/**
 * 15.7
 */
window.onload = function() {
  var toc = document.getElementById("TOC");
  if (!toc) {
    toc = document.createElement("div");
    toc.id = "TOC";
    document.body.insertBefore(toc, document.body.firstChild);
  }

  var headings;
  if (document.querySelectorAll) {
    headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  } else {
    headings = findHeadings(document.body, [])
  }

  // 递归查找标题元素
  function findHeadings(root, sects) {
    for(var c = root.firstChild; c != null; c = c.nextSibling) {
      if (c.nodeType !== 1) continue;
      if (c.tagName.length == 2 && c.tagName.charAt(0) == "H") {
        sects.push(c)
      } else {
        findHeadings(c, sects);
      }
    }
    return sects;
  }
  // 初始化一个数组来保持跟踪章节号
  var sectionNumbers = [0,0,0,0,0,0];

  for(var h = 0; h < headings.length; h++) {
    var heading = headings[h];
    if (heading.parentNode == toc) continue;

    var level = parseInt(heading.tagName.charAt(1));
    if (isNaN(level) || level < 1 || level > 6) continue;

    sectionNumbers[level-1]++;
    for(var i = level; i < 6; i++) {
      sectionNumbers[i] = 0;
    }
    var sectionNumber = sectionNumbers.slice(0, level).join(".")

    var span = document.createElement("span");
    span.className = "TOCSectNum";
    span.innerHTML = sectionNumber;
    heading.insertBefore(span, heading.firstChild);

    var anchor = document.createElement("a");
    anchor.name = "TOC"+sectionNumber;
    heading.parentNode.insertBefore(anchor, heading);
    anchor.appendChild(heading);

    var link = document.createElement("a");
    link.href = "#TOC" + sectionNumber;
    link.innerHTML = heading.innerHTML;

    var entry = document.createElement("div");
    entry.className = "TOCEntry TOCLevel" + level;
    entry.appendChild(link);

    toc.appendChild(entry);
  }
}