/**
 * 16.2.1
 */
// 同时指定元素的left和right，可以设置元素的宽度，但优先级没有width高

/**
 * 16.3
 */
function shake(e, oncomplete, distance, time) {
  if (typeof e === "string") e = document.getElementById(e);
  if (!time) time = 500;
  if (!distance) distance = 5;
  var originalStyle = e.style.cssText;
  e.style.position = "relative";
  var start = (new Date()).getTime();
  animate();

  function animate() {
    var now = (new Date()).getTime();
    var elapsed = now - start;
    var fraction = elapsed / time;
    
    if (fraction < 1) { // 动画未完成
      var x = distance * Math.sin(fraction * 4 * Math.PI);
      e.style.left = x + "px";
  
      setTimeout(animate, Math.min(25, time-elapsed));
    } else {
      e.style.cssText = originalStyle;
      if (oncomplete) oncomplete(e);
    }
  }
}

function fadeOut(e, oncomplete, time) {
  if (typeof e === "string") e = document.getElementById(e);
  if (!time) time = 500;

  var ease = Math.sqrt;
  var start = (new Date()).getTime();
  animate();

  function animate() {
    var elapsed = (new Date()).getTime() - start;
    var fraction = elapsed / time;
    if (fraction < 1) {
      var opacity = 1 - ease(fraction);
      e.style.opacity = String(opacity);
      setTimeout(animate, Math.min(25, time-elapsed));
    } else {
      e.style.opacity = "0";
      if (oncomplete) oncomplete(e);
    }
  }
}

/**
 * 16.4
 */
function scale(e, factor) {
  var size = parseInt(window.getComputedStyle(e, "").fontSize);
  e.style.fontSize = factor * size + "px";
}

function scaleColor(e, factor) {
  var color = window.getComputedStyle(e, "").backgroundColor;
  // rgba(255, 222, 225, 0.4)匹配正则：[255, 222, 225, 0.4]; \.匹配小数
  var components = color.match(/[\d\.]+/g);
  for(var i = 0; i < 3; i++) {
    var x = Number(components[i]) * factor;
    x = Math.round(Math.min(Math.max(x, 0), 255)); //设置边界，然后取整
    components[i] = String(x);
  }

  if (components.length == 3) { // rgb()
    e.style.backgroundColor = "rgb(" + components.join() + ")";
  } else {                      // rgba()
    e.style.backgroundColor = "rgba(" + components.join() + ")";
  }
}

/**
 * 16.5
 */
function grabAttention(e) {
  e.className = "attention";
}
function releaseAttention(e) {
  e.className = "";
}

function classList(e) {
  if (e.classList) return e.classList;
  else return new CSSClassList(e);
}
// CSSClassList类, 用于模拟DOMTokenList
function CSSClassList(e) {
  this.e = e;
}

CSSClassList.prototype.contains = function(c) {
  if (c.length === 0 || c.indexOf(" ") != -1) {
    throw new Error("Invalid class name: '" + c + "'");
  }
  var classes = this.e.className;
  if (!classes) return false;
  if (classes === c) return true;
  // \b 代表单词边界
  return classes.search("\\b" + c + "\\b") != -1;
}

CSSClassList.prototype.add = function(c) {
  if (this.contains(c)) return
  var classes = this.e.className;
  if (classes && classes[classes.length - 1] != " ") {
    c = " " + c;
  }
  this.e.className += c;
}

CSSClassList.prototype.remove = function(c) {
  if (c.length === 0 || c.indexOf(" ") != -1) {
    throw new Error("Invalid class name: '" + c + "'");
  }
  var pattern = new RegExp("\\b" + c + "\\b\\s*", "g");
  this.e.className = this.e.className.replace(pattern, "");
}

CSSClassList.prototype.toggle = function(c) {
  if (this.contains(c)) {
    this.remove(c);
    return false
  } else {
    this.add(c);
    return true;
  }
}

CSSClassList.prototype.toString = function() {
  return this.e.className;
}

CSSClassList.prototype.toArray = function() {
  return this.e.className.match(/\b\w+\b/g) || [];
}

/**
 * 16.6.1
 */
function disableStylesheet(ss) {
  if (typeof ss === "number") {
    document.styleSheets[ss].disabled = true;
  } else {
    var sheets = document.querySelectorAll(ss);
    for (var i = 0; i < sheets.length; i++) {
      sheets[i].disabled = true;
    }
  }
}

/**
 * 16.6.2
 */
var ss = document.styleSheets[0];
var rules = ss.cssRules ? ss.cssRules : ss.rules;

for (var i = 0; i < rules.length; i++) {
  var rule = rules[i];
  if (!rule.selectorText) continue;
  var selector = rule.selectorText;
  var ruleText = rule.style.cssText;
  if (selector == "h1") {
    if (ss.insertRule) {
      ss.insertRule("h2 {" + ruleText + "}", rules.length);
    } else if (ss.addRule) {
      ss.addRule("h2", ruleText, rules.length);
    }
  }

  if (rule.style.textDecoration) {
    if (ss.deleteRule) {
      ss.deleteRule(i)
    } else if (ss.removeRule) {
      ss.removeRule(i)
    }
    i--;
  }
}

/**
 * 16.6.3
 */
function addStyles(styles) {
  var styleElt, styleSheet;
  if (document.createStyleSheet) { // IE
    styleSheet = document.createStyleSheet();
  } else {
    var head = document.getElementsByTagName('head')[0];
    styleElt = document.createElement("style");
    head.appendChild(styleElt);
    styleSheet = document.styleSheets[document.styleSheets.length-1]
  }

  if (typeof styles === "string") {
    if (styleElt) {
      styleElt.innerHTML = styles;
    } else {
      styleSheet.cssText = styles; // IE
    }
  } else {
    var i = 0;
    for (selector in styles) {
      if (styleSheet.insertRule) {
        var rule = selector + " {" + styles[selector] + "}";
        styleSheet.insertRule(rule, i++);
      } else {
        styleSheet.addRule(selector, styles[selector], i++)
      }
    }
  }

}