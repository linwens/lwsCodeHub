/**
 * 17.2.1 
 */
// 设置window对象的unload属性为一个函数
// 该函数是事件处理程序；但文档加载完毕时调用它
window.onload = function() {
  // 查找一个<form>元素
  var elt = document.getElementById('shipping_address');
  console.log(elt)
  // 注册时间处理程序函数
  // 在表单提交前调用它
  elt.onsubmit = function() { return validate(this);}
}
// 自己写个validaate方法防报错
function validate(el) {
  console.log(el)
}
// 防止dom未找到，把示例代码都放到onload事件回调里
window.onload = function() { 
  /**
   *  17.2.3
   */
  var b = document.getElementById("mybutton");
  console.log(b)
  b.onclick = function() {
    alert("Thanks for clicking me! ")
  };
  b.addEventListener("click", function() {
    alert("Thanks again!")
  }, false)
  /**
   *  17.2.4
   */
  var handler = function() {
    alert("Thanks!")
  }
  if (b.addEventListener) {
    b.addEventListener("click", handler, false);
  } else if (b.attachEvent) {
    b.attachEvent("onclick", handler);
  }
  /**
   *  17.3.1
   */
  function handler(event) {
    event = event || window.event
  }
  /**
   *  17.3.2
   */
  // 当使用addEventListener(fn)注册事件时，fn内this指向事件target;但是attachEvent(fn)注册时，fn内的this只想window
  function addEvent(target, type, handler) {
    if (target.addEventListener) {
      target.addEventListener(type, handler, false);
    } else {
      target.attachEvent("on" + type, function(event) {
        // 用call改变this指向
        return handler.call(target, event)
      })
    }
  }
  //?+ 注意使用这个方法注册的事件处理程序不能删除，因为传递给attachEvent()的包装函数没有保留下来传递给detachEvent().
  /**
   *  17.3.7
   */
  function cancelHandler(event) {
    var event = event || window.event;

    if (event.preventDefault) {
      event.preventDefault()
    }
    if (event.returnValue) {
      event.returnValue = false;
    }
    return false; //?+ 用于处理使用对象属性注册的处理程序
  }
}
/**
   * 17.4 whenReady确保文档加载完成了再执行想要执行的函数
   */
  /**
   * 传递函数给whenReady()，当文档解析完毕且为操作准备就绪时，
   * 函数将作为文档对象的方法调用
   * DOMContentLoaded、readystatechange或load事件发生时会触发注册函数
   * 一旦文档准备就绪，所有函数都会被调用，任何传递给whenReady()的函数都将立即调用
   */
var whenReady = (function() {
  var funcs = []; //当获得事件时，要运行的函数
  var ready = false; // 当触发事件处理程序时，切换到true
  
  //当文档准备就绪时，调用事件处理程序
  function handler(e) {
    // 如果运行过一次就直接返回
    if (ready) return;
    // 有readystatechange事件，但状态不是complete，说明文档没准备好，直接返回
    if (e.type === 'readystatechange' && document.readyState !== "complete") return;
    // 运行所有注册的函数，每次都重新计算funcs的长度，因为函数的调用可能会导致注册更多的函数
    for (var i = 0; i < funcs.length; i++) {
      funcs[i].call(document);
    }
    // 注册函数执行完，ready变为true，funcs清空
    ready = true; funcs = null;
  }
  // 给文档事件绑定处理程序handler
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", handler, false);
    document.addEventListener("readystatechange", handler, false);
    window.addEventListener("load", handler, false);
  } else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", handler);
    window.attachEvent("onload", handler);
  }
  // 返回whenReady()函数
  return function whenReady(f) {
    if (ready) { //文档准备完毕，执行传入的函数
      f.call(document);
    } else { //文档没准备完毕，就加入队列
      funcs.push(f);
    }
  }
}())
/**
 * 17.5 getScrollOffsets()方法出现在15.8.1
 */
function getScrollOffsets(w) {
  w = w || window;
  // 针对IE
  if (w.pageXOffset != null) {
    return {
      x: w.pageXOffset,
      y: w.pageYOffset
    }
  }
  var d = w.document;
  if (document.compatMode == "CSS1Compat") {
    return {
      x: d.documentElement.scrollLeft,
      y: d.documentElement.scrollTop
    }
  }
  // 针对怪异模式下的浏览器
  return {
    x: d.body.scrollLeft,
    y: d.body.scrollTop
  }
}
function drag(elementToDrag, event) {
  // 获取 "鼠标" 初始位置（相对于文档左上角，所以要考虑滚动条的情况）
  var scroll = getScrollOffsets();
  var startX = event.clientX + scroll.x;
  var startY = event.clientY + scroll.y;

  // 获取 "被拖动元素"（绝对定位） 的初始位置
  var origX = elementToDrag.offsetLeft;
  var origY = elementToDrag.offsetTop;

  // 获取 "鼠标按下后，鼠标和元素的坐标差"
  var deltaX = startX - origX;
  var deltaY = startY - origY;

  // 注册事件处理程序
  if (document.addEventListener) {
    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler, true);
  } else if (document.attachEvent) {
    // IE上，捕获事件是通过调用元素上的setCapture()
    elementToDrag.setCapture();
    elementToDrag.attachEvent("onmousemove", moveHandler);
    elementToDrag.attachEvent("onmouseup", upHandler);
    elementToDrag.attachEvent("onlosecapture", upHandler);
  }
  // stopPropagation()方法阻止事件的继续传播，如果是同一个元素上的事件会继续被调用，但后面所有对象上注册的事件都不会被调用
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }

  // 阻止默认事件
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
  // 声明 mousemove对应的事件
  function moveHandler(e) {
    if (!e) {
      e = window.event;
    }
    var scroll = getScrollOffsets();
    elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
    elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + "px";
    // 同时组织后续元素事件的执行
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }
  // 声明 鼠标放掉 终止拖动的事件
  function upHandler(e) {
    if (!e) {
      e = window.event;
    }
    // 注销之前绑定的事件
    if (document.removeEventListener) {
      document.removeEventListener("mouseup", upHandler, true);
      document.removeEventListener("mousemove", moveHandler, true);
    } else if (document.detachEvent) {
      elementToDrag.detachEvent("onlosecapture", upHandler);
      elementToDrag.detachEvent("onmouseup", upHandler);
      elementToDrag.detachEvent("onmousemove", moveHandler);
      elementToDrag.releaseCapture();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }
}
/**
 * 17.6
 */
// 把内容元素装入(50 x 50)的窗体或者视口内
// 可选参数contentX/contentY指定内容相对于窗体的初始偏移量 (如指定，必须 <=0)
function enclose(content, framewidth, frameheight, contentX, contentY) {
  framewidth = Math.max(framewidth, 50);
  frameheight = Math.max(frameheight, 50);
  contentX = Math.min(contentX, 0) || 0;
  contentY = Math.min(contentY, 0) || 0;

  // 创建一个frame元素
  var frame = document.createElement("div");
  frame.className = "enclosure";
  frame.style.width = framewidth + "px";
  frame.style.height = frameheight + "px";
  frame.style.overflow = "hidden";
  frame.style.boxSizing = "border-box";
  frame.style.webkitBoxSizing = "border-box";
  frame.style.MozBoxSizing = "border-box";
  // 把frame放入文档中，并把内容移入frame中
  content.parentNode.insertBefore(frame, content); // 第二个参数是已有的节点，新元素会插在这个元素之前
  frame.appendChild(content);

  content.style.position = "relative";
  content.style.left = contentX + "px";
  content.style.top = contentY + "px";

  // 兼容不同浏览器
  var isMacWebkit = (navigator.userAgent.indexOf("Macintosh") !== -1 && navigator.userAgent.indexOf("WebKit") !== -1);
  var isFirefox = (navigator.userAgent.indexOf("Gecko") !== -1);

  // 注册mousewheel事件处理程序
  frame.onwheel = wheelHandler; // 未来浏览器
  frame.onmousewheel = wheelHandler; // 大多数当前浏览器
  if (isFirefox) {
    frame.addEventListener("DOMMouseScroll", wheelHandler, false);
  }

  function wheelHandler(event) {
    var e = event || window.event;
    // 控制滚轮滚动一次， 对应移动的距离，可以用来控制滚轮的灵敏度
    var deltaX = e.deltaX*-10 || // 针对wheel事件
                 e.wheelDeltaX/4 || // 针对mousewheel事件
                 0;
    var deltaY = e.deltaY*-10 ||
                 e.wheelDeltaY/4 ||
                 (e.wheelDeltaY ===undefined && e.wheelDelta/4) || // 如果没有2D的属性，就有1D的滚轮
                 e.detail*-10 || // firefox的DOMMouseScroll事件
                 0;
    
    if (isMacWebkit) {
      deltaX /= 30; // deltaX = deltaX / 30
      deltaY /= 30;
    }
    // 如果Firefox支持mousewheel和wheel，就不需要DOMMouseScroll
    if (isFirefox & e.type !== "DOMMouseScroll") {
      frame.removeEventListener("DOMMouseScroll", wheelHandler, false);
    }
    // 获取内容元素的当前尺寸
    var contentbox = content.getBoundingClientRect(); //getBoundingClientRect返回元素的大小及其相对于视口的位置
    var contentwidth = contentbox.right - contentbox.left;
    var contentheight = contentbox.bottom - contentbox.top;

    if (e.altKey) { //按下alt键， 可调整frame大小
      if (deltaX) {
        framewidth -= deltaX;
        framewidth = Math.min(framewidth, contentwidth);
        framewidth = Math.max(framewidth, 50);
        frame.style.width = framewidth + "px";
      }
      if (deltaY) {
        frameheight -= deltaY;
        frameheight = Math.min(frameheight, contentheight);
        frameheight = Math.max(frameheight-deltaY, 50);
        frame.style.height = frameheight + "px";
      }
    } else {
      if (deltaX) {
        var minoffset = Math.min(framewidth-contentwidth, 0);
        contentX = Math.max(contentX + deltaX, minoffset);
        contentX = Math.min(contentX, 0);
        content.style.left = contentX + "px"
      }
      if (deltaY) {
        var minoffset = Math.min(frameheight-contentheight, 0);
        contentY = Math.max(contentY + deltaY, minoffset);
        contentY = Math.min(contentY, 0);
        content.style.top = contentY + "px"
      }
    }

    // 阻止事件冒泡，阻止任何默认操作
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }
}
/**
 * 17.8
 */
function InputFilter() {
  var inputelts = document.getElementsByTagName("input");

  for(var i = 0; i < inputelts.length; i++) {
    var elt = inputelts[i];
    if (elt.type != "text" || !elt.getAttribute("data-allowed-chars")) continue
    // 注册事件处理程序
    if (elt.addEventListener) {
      elt.addEventListener("keypress", filter, false);
      elt.addEventListener("textInput", filter, false);
      elt.addEventListener("textinput", filter, false);
    } else {
      elt.attachEvent("onkeypress", filter)
    }
  }
  function filter(event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var text = null;
    if (e.type === "textinput" || e.type === "textInput") {
      text = e.data;
    } else {
      var code = e.charCode || e.keyCode;
      if (code<32 || e.charCode == 0 || e.ctrlKey || e.altKey) return;
      var text = String.fromCharCode(code); // fromCharCode() 可接受一个指定的 Unicode 值，然后返回一个字符串
    }
    // 从input元素中寻找所需信息
    var allowed = target.getAttribute("data-allowed-chars");
    var messageid = target.getAttribute("data-messageid");
    if (messageid) {
      var messageElement = document.getElementById(messageid)
    }
    for (var i = 0 ; i < text.length; i++) {
      var c = text.charAt(i); // charAt() 方法可返回指定位置的字符
      if (allowed.indexOf(c) == -1) {
        if (messageElement) messageElement.style.visibility = "visible";
        // 取消默认行为，不可再插入文本信息
        if (e.preventDefault) e.preventDefault();
        if (e.returnValue) e.returnValue = false;
        return false;
      }
    }
    if (messageElement) messageElement.style.visibility = "hidden";
  }
}

// 探测文本输入，并强制所有输入都是大写
function forceToUpperCase(element) {
  if (typeof element === "string") {
    element = document.getElementById(element);
  }
  // 探测文本输入
  element.oninput = upcase;
  element.onpropertychange = upcaseOnPropertyChange; // 处理IE
  // 写事件处理程序
  function upcase(event) {
    this.value = this.value.toUpperCase();
  }
  function upcaseOnPropertyChange(event) {
    var e = event ||window.event;
    if (e.propertyName === "value") {
      // 移除onpropertychange处理程序，避免循环调用
      this.onpropertychange = null;
      this.value = this.value.toUpperCase();
      // 然后回复原来的propertychange处理程序
      this.onpropertychange = upcaseOnPropertyChange;
    }
  }
}

/**
 * 17.9 键盘快捷键的Keymap类
 */
function Keymap(bindings) {
  this.map = {}; // 处理程序映射 
  if (bindings) {
    for(name in bindings) {
      this.bind(name, bindings[name]);
    }
  }
}
// 绑定指定的按键标识符和指定的处理程序函数
Keymap.prototype.bind = function(key, func) {
  this.map[Keymap.normalize(key)] = func;
}
// 删除指定按键标识符的绑定
Keymap.prototype.unbind = function(key) {
  delete this.map[Keymap.normalize(key)]
}
// 给元素绑定事件处理函数
Keymap.prototype.install = function(element) {
  var keymap = this;
  function handler(event) {
    return keymap.dispatch(event, element);
  }
  if (element.addEventListener) {
    element.addEventListener("keydown", handler, false);
  } else if (element.attachEvent) {
    element.attachEvent("onkeydown", handler);
  }
}
//基于Keymap绑定分派按键事件
Keymap.prototype.dispatch = function(event, element) {
  var modifiers = "";
  var keyname = null;
  if (event.altKey) modifiers += "alt_";
  if (event.ctrlKey) modifiers += "ctrl_";
  if (event.metaKey) modifiers += "meta_";
  if (event.shiftKey) modifiers += "shift_";
  
  if (event.key) {
    keyname = event.key; //基于3级DOM的实现
  } else if (event.keyIdentifier && event.keyIdentifier.substring(0, 2) !== "U+") {
    keyname = event.keyIdentifier; // safari chrome
  } else {
    keyname = Keymap.keyCodeToKeyName[event.keyCode]
  }
  if (!keyname) return;
  var keyid = modifiers + keyname.toLowerCase();
  var handler = this.map[keyid];
  if (handler) { // 当前按键绑定了处理程序
    var retval = handler.call(element, event, keyid);
    if (retval === false) {
      if (event.stopPropagation) {
        event.stopPropagation()
      } else {
        event.cancelBubble = true
      }
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false;
      }
    }
    return retval
  }
}
// 把按键标识符转换成标准形式的工具函数
Keymap.normalize = function(keyid) {
  keyid = keyid.toLowerCase();
  var words = keyid.split(/\s+|[\-+_]/); // 分割辅助键和键名
  var keyname = words.pop(); //键名是最后一个
  keyname = Keymap.aliases[keyname] || keyname; // 处理别名
  words.sort();
  words.push(keyname)
  return words.join("_")
}
Keymap.aliases = {
  "escape": "esc",
  "delete": "del",
  "return": "enter",
  "ctrl": "control",
  "space": "spacebar",
  "ins": "insert",
}
Keymap.keyCodeToKeyName = {
  
}