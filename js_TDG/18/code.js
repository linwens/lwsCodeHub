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