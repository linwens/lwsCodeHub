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