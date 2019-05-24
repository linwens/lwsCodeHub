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