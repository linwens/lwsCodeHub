/**
 * 14.1
 */
function invoke(f, start, interval, end) {
  if (!start) start = 0;
  if (arguments.length <= 2) {
    setTimeout(f, start);
  } else {
    setTimeout(repeat, start);
    function repeat() {
      var h = setInterval(f, interval);
      if (end) {
        setTimeout(function(){
          clearInterval(h);
        }, end);
      }
    }
  }
}

/**
 * 14.2
 */
window.location === document.location; // true

/**
 * 14.2.1
 */

function urlArgs() {
  var args = {};
  var query = location.search.substring(1);
  var pairs = query.split("&");

  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf("=");
    if (pos == -1) continue;
    var name = pairs[i].substring(0, pos);
    var value = pairs[i].substr(pos+1);
    value = decodeURIComponent(value);
    args[name] = value;
  }
  return args;
}

/**
 * 14.2.2
 */
// location.assign()
// location.replace()
// location.reload()

// location = "#top";

/**
 * 14.4.1
 */
var browser = (function() {
  var s = navigator.userAgent.toLowerCase();
  var match = /(webkit)[ \/]([\w.]+)/.exec(s) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(s) ||/(msie) ([\w.]+)/.exec(s) || !/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) || [];
  return {
    name: match[1] || "",
    version: match[2] ||"0"
  }
}());

/**
 * 14.5
 */
// 阻塞后面的代码，所以注释掉
/* do {
  var name = prompt("what is your name?");
  var correct = confirm("You entered '" + name + "'.\n" + "Click Okay to proceed or Cannel to re-enter.");
} while(!correct)
alert("Hello, " + name); */

// showModalDialog方法已在Chrome 43和Firefox 56中删除
// var p = window.showModalDialog("index.html", ["enter 3d point coordinates", "x", "y", "z"],"dialogwidth:400; dialogheight:300; resizeable:yes");

/**
 * 14.6
 */
window.onerror = function(msg, url, line) {
  if (onerror.num++ < onerror.max) {
    alert("ERROR: " + msg + "\n" + url + ":" + line);
    return true;
  }
}
onerror.max = 3;
onerror.num = 0;

/**
 * 14.8.1
 */
var w = window.open("smallwin.html", "smallwin", "width=400,height=350,status=yes,resizable=yes");
window.onload = function(){
  var btn = document.getElementById('winOpen');
  btn.addEventListener('click', function(e){
    var w = window.open();
    w.alert("About to visit http://example.com");
    w.location = "http://example.com";
  
    w.alert(w.opener != null); // true
    w.alert(w.opener === window); // true
    w.close();
  })

}

/**
 * 14.8.2
 */
window.onload = function(){
  var elt = document.getElementById("f1");
  var win = elt.contentWindow; // contentWindow获取窗体的window对象

  // 窗体的window对象的frameElement获取当前窗体对应的iframe元素
  alert(win.frameElement === elt); // true
  alert(window.frameElement === null); // true
}
