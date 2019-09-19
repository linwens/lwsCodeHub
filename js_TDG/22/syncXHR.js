// worker里走同步ajax请求
onmessage = function(e) {
  var urls = e.data;
  var contents = [];
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false); //同步请求
    xhr.send();
    if (xhr.status !== 200) {
      throw Error(xhr.status + " " + xhr.statusText + ": " + url);
    }
    contents.push(xhr.responseText);
  }
  postMessage(contents);
}