// 书中别处抄来的公共函数
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
 * 18.1
 */
// IE5和IE6中模拟XMLHttpRequest()构造函数
if (window.XMLHttpRequest === undefined) {
  window.XMLHttpRequest = function() {
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (e1) {
      try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0")
      } catch (e2) {
        throw new Error("XMLHttpRequest is not supported");
      }
    }
  }
}

/**
 * 18.1.1
 */

function postMessage(msg) {
  var request = new XMLHttpRequest();
  request.open("post", "/log.php");
  request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
  request.send(msg);
}

/**
 * 18.1.2
 */
// 默认异步
function getText(url, callback) {
  var request = new XMLHttpRequest()
  request.open("GET", url)
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var type = request.getResponseHeader("Content-Type")
      if (type.match(/^text/)) {
        callback(request.responseText)
      }
    }
  }
  request.send(null) // 立即发送请求
}
// 同步
function getTextSync(url) {
  var request = new XMLHttpRequest()
  request.open("GET", url, false)
  request.send(null)
  if (request.status !== 200) {
    throw new Error(request.statusText)
  }
  var type = request.getResponseHeader("Content-Type")
  if (!type.match(/^text/)) {
    throw new Error("Expected textual response; got: " + type);
  }
  return request.responseText
}
// 后端返回的不是常规的MIME类型
function get(url, callback) {
  var request = new XMLHttpRequest()
  request.open("GET",url)
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var type = request.getResponseHeader("Content-type")
      if (type.indexOf("xml") !== -1 && request.responseXML) {
        callback(request.responseXML)
      } else if (type === "application/json") {
        callback(JSON.parse(request.responseText))
      } else {
        callback(request.responseText)
      }
    }
  }
  // overrideMimeType()让XMLHttpRequest忽略“Content-type”而使用制定的类型，需在send()之前调用
  // request.overrideMimeType("text/plain; charset=utf-8")
  request.send(null)
}
/**
 * 18.1.3
 */

function encodeFormData(data) {
  if (!data) return ""
  var pairs = []
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue // 跳过继承属性
    if (typeof data[name] === "function") continue
    var value = data[name].toString()
    name = encodeURIComponent(name.replace("%20", "+"))
    value = encodeURIComponent(value.replace("%20", "+"))
    pairs.push(name + "=" + value)
  }
  return pairs.join('&')
}
function postData(url, data, callback) {
  var request = new XMLHttpRequest()
  request.open("POST", url)
  request.onreadystatechange = function() {
    if (request.readyState === 4 && callback) {
      callback(request);
    }
  };
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  request.send(encodeFormData(data)) // 发送编码后的数据
}
function getData(url, data, callback) {
  var request = new XMLHttpRequest()
  request.open("GET",url + "?" + encodeFormData(data))
  request.onreadystatechange = function() {
    if (request.readyState === 4 && callback) {
      callback(request)
    }
  }
  request.send(null)
}
function postJSON(url, data, callback) {
  var request = new XMLHttpRequest()
  request.open("POST", url)
  request.onreadystatechange = function() {
    if (request.readyState === 4 && callback) {
      callback(request)
    }
  }
  request.setRequestHeader("Content-Type", "application/json")
  request.send(JSON.stringify(data))
}
//-------这里有一个xml的示例，没抄
// 文件上传
whenReady(function() {
  var elts = document.getElementsByTagName("input");
  for (var i = 0; i < elts.length; i++) {
    var input = elts[i];
    if (input.type !== "file") continue
    var url = input.getAttribute("data-uploadto")
    if (!url) continue
    input.addEventListener("change", function() {
      var file = this.files[0];
      if (!file) return
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.send(file);
    }, false)
  }
})
// 同时上传文件和其他元素 multipart/form-data
function postFormData(url, data, callback) {
  if (typeof FormData === "undefined") {
    throw new Error("FormData is not implemented")
  }
  var request = new XMLHttpRequest()
  request.open("POST", url)
  request.onreadystatechange = function() {
    if (request.readyState === 4 && callback) {
      callback(request)
    }
  }
  var formdata = new FormData()
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue
    var value = data[name]
    if (typeof value === "function") continue
    // 通俗的理解就是插入要发送的数据，到时候一起send
    formdata.append(name, value)
  }
  request.send(formdata)
}
/**
 * 18.1.4 HTTP进度事件  **
 */
whenReady(function() {
  var elts = document.getElementsByClassName("fileDropTarget");
  for (var i = 0; i < elts.length; i++) {
    var target = elts[i];
    var url = target.getAttribute("data-uploadto")
    if (!url) continue
    createFileUploadDropTarget(target, url);
  }
  function createFileUploadDropTarget(target, url) {
    var uploading = false; // 标识是否正在上传
    console.log(target, url)
    target.ondragenter = function(e) {
      console.log("dragenter")
      if (uploading) return
      var types = e.dataTransfer.types;
      if (types && ((types.contains && types.contains("Files")) || (types.indexOf && types.indexOf("Files") !== -1))) {
        target.classList.add("wantdrop");
        return false;
      }
    };
    target.ondrop = function(e) {
      if (uploading) return false
      var files = e.dataTransfer.files;
      if (files && files.length) {
        uploading = true
        var message = "Uploading files:<ul>";
        for (var i = 0 ;i < files.length; i++) {
          message += "<li>" + files[i].name + "</li>"
        }
        message += "</ul>"

        target.innerHTML = message
        target.classList.remove("wantdrop")
        target.classList.add("uploading")

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url)
        var body = new FormData()
        for (var i = 0; i < files.length; i++) {
          body.append(i, files[i]); // 注意append是 FormData实例的方法
        }
        xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) {
            target.innerHTML = message + Math.round(e.loaded/e.total*100) + "% Complete";
          }
        }

        xhr.upload.onload = function(e) {
          uploading = false;
          target.classList.remove("uploading");
          target.innerHTML = "Drop files to upload"
        }
        xhr.send(body)

        return false
      }
      target.classList.remove("wantdrop")
    }
  }
})

/**
 * 18.1.5 
 */
function timedGetText(url, timeout, callback) {
  var request = new XMLHttpRequest()
  var timedout = false;
  var timer = setTimeout(function() {
    timedout = true;
    request.abort() //中止请求
  }, timeout)
  request.open("GET", url)
  // 部分请求达到，可能会改变status的值，导致触发了回掉函数，而实际上部分请求已经超时了
  // 所以书上说用load事件没这个风险
  request.onreadystatechange = function() {
    if (request.readyState !==4) return
    if (timedout) return // 已经超时了就不继续后面的
    clearTimeout(timer)
    if (request.status === 200) {
      callback(request.responseText)
    }
  }
  request.send(null)
}

/**
 * 18.1.6
 */
whenReady(function() {
  // 通过 XMLHttpRequest中的 withCredentials，测试浏览器是否支持CORS跨域
  var supportsCORS = (new XMLHttpRequest()).withCredentials !== undefined;
  // 遍历文档中的所有链接
  var links = document.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (!link.href) continue
    if (link.title) continue
    // 如果是一个跨域链接
    if (link.host !== location.host || link.protocol !== location.protocol) {
      link.title = "站外链接";
      if (!supportsCORS) continue // 不支持跨越就退出
    }
    if (link.addEventListener) {
      link.addEventListener("mouseover", mouseoverHandler, false);
    } else {
      link.attachEvent("mouseover", mouseoverHandler)
    }
  }

  function mouseoverHandler(e) {
    var link = e.target || e.srcElement; //e.srcElement 针对IE的兼容处理，可以捕获当前事件作用的对象
    var url = link.href;
    var req = new XMLHttpRequest();
    req.open("HEAD", url) // HEAD方法，仅仅询问头信息
    req.onreadystatechange = function() {
      if (req.readyState !== 4) return
      if (req.status === 200) {
        var type = req.getResponseHeader("Content-Type");
        var size = req.getResponseHeader("Content-Length");
        var date = req.getResponseHeader("Last-Modified");
        link.title = "类型: " + typpe + "\n" + "大小: " + size + "\n" + "时间: " + date;
      } else {
        if (!link.title) {
          link.title = "Couldn't fetch details:\n" + req.status + " " + req.statusText;
        }
      }
    };
    req.send(null);
    // 一处处理程序，仅向一次获取这些头信息
    if (link.removeEventListener) {
      link.removeEventListener("mouseover", mouseoverHandler, false);
    } else {
      link.detachEvent("onmouseover", mouseoverHandler)
    }
  }
})

/**
 * 18.2 JSONP
 */
function getJSONP(url, callback) {
  var cbnum = "cb" + getJSONP.counter++;
  var cbname = "getJSONP." + cbnum;

  if (url.indexOf("?") === -1) {
    url += "?jsonp=" + cbname;
  } else {
    url += "&jsonp=" + cbname;
  }

  // 创建script标签用于发送请求
  var script = document.createElement("script");
  getJSONP[cbnum] = function(response) {
    try {
      callback(response)
    } finally { // 无论结果如何，都会执行的代码块
      delete getJSONP[cbnum]
      script.parentNode.removeChild(script)
    }
  };
  script.src = url;
  document.body.appendChild(script)
}
getJSONP.counter = 0; // 用于创建唯一回调函数名称的计数器

/**
 * 18.3 聊天室
 */
window.onload = function() {
  var nick = prompt("Enter your nickname")
  var input = document.getElementById("input");
  input.focus();

  // 通过 EventSource 注册新消息的通知
  var chat = new EventSource("/chat");
  chat.onmessage = function(event) {
    var msg = event.data;
    var node = document.createTextNode(msg);
    var div = document.createElement("div");
    div.appendChild(node);
    document.body.insertBefore(div, input)
    input.scrollIntoView() // 保证input元素可见
  }

  // 使用 XMLHttpRequest把用户的消息发送给服务器
  input.onchange = function() {
    var msg = nick + ': ' + input.value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/chat");
    xhr.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
    xhr.send(msg);
    input.value = "";
  }
}
  // XMLHttpRequest 模拟 EventSource
if (window.EventSource === undefined) {
  window.EventSource = function(url) {
    var xhr;
    var evtsrc = this;
    var charsReceived = 0;
    var type = null;
    var data = "";
    var eventName = "message";
    var lastEventId = "";
    var retrydelay = 1000;
    var aborted = false;

    xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      switch(xhr.readyState) {
        case 3: processData(); break;
        case 4: reconnect(); break;
      }
    }
    function reconnect() {
      if (aborted) return
      if (xhr.status >= 300) return
      setTimeout(connect, retrydelay) // 等待1秒后重连
    }
    // 通过connect创建一个长期存在的链接
    connect()
    function connect() {
      charsReceived = 0;
      type = null;
      xhr.open("GET", url);
      xhr.setRequestHeader("Cache-Control", "no-cache");
      if (lastEventId) {
        xhr.setRequestHeader("Last-Event-ID", lastEventId);
      }
      xhr.send();
    }

    function processData() {
      if (!type) {
        type = xhr.getResponseHeader('Content-Type');
        if (type !== "text/event-stream") {
          aborted = true;
          xhr.abort();
          return;
        }
      }

      var chunk = xhr.responseText.substring(charsReceived);
      charsReceived = xhr.responseText.length;

      var lines = chunk.replace(/(\r\n|\r|\n)$/, "").split(/\r\n|\r|\n/);
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i], 
            pos = line.indexOf(":"), 
            name, 
            value="";
        if (pos === 0) continue
        if (pos> 0) {
          name = line.substring(0, pos);
          value = line.substring(pos+1);
          if (value.charAt(0) == " ") {
            value = value.substring(1);
          }
        } else {
          name = line;
        }

        switch(name) {
          case "event": eventName = value; break;
          case "data": data += value + "\n"; break;
          case "id": lastEventId = value; break;
          case "retry": retrydelay = parseInt(value) || 1000; break;
          default: break;
        }

        if (line === "") {
          if (evtsrc.onmessage &&data != "") {
            if (data.charAt(data.length-1) = "\n") {
              data = data.substring(0, data.length -1)
            }
            evtsrc.onmessage({
              type: eventName,
              data: data,
              origin: url
            });
          }
          data = "";
          continue;
        }
      }
    }
  }
}