// “I/O（英语：Input/Output），即输入/输出，通常指数据在内部存储器和外部存储器或其他周边设备之间的输入和输出
/**
 * 12.2.1
 */
var http = require('http');
var fs = require('fs');
var server = new http.Server();
server.listen(8000);

var httputils = require("./httputils"); // 12.2.2

server.on("request", function(request, response) {
  var url = require('url').parse(request.url);

  httputils.get(url, function(status, headers, body) {
    console.log(body);
  })
  
  if (url.pathname === "/test/delay") {
    var delay = parseInt(url.query) || 2000;
    response.writeHead(200, {
      "Content-Type": "text/plain; charset=UTF-8"
    });
    response.write("Sleeping for " + delay + " milliseconds...");
    setTimeout(function() {
      response.write("done.");
      response.end();
    }, delay);
  } else if (url.pathname === "/test/mirror"){
    response.writeHead(200, {
      "Content-Type": "text/plain; charset=UTF-8"
    });
    response.write(request.method + " " + request.url + " HTTP/" + request.httpVersion + "\r\n");
    for (var h in request.headers) {
      response.write(h + ": " + request.headers[h] + "\r\n");
    }
    response.write("\r\n");
    request.on("data", function(chunk) {
      response.write(chunk)
    })
    request.on("end", function(chunk) {
      response.end()
    })
  } else {
    var filename = url.pathname.substring(1);
    var type;
    switch(filename.substring(filename.lastIndexOf(".")+1)) {
      case "html":
      case "htm": type = "text/html; charset=UTF-8"; break;
      case "js": type = "application/javascript; charset=UTF-8"; break;
      case "css": type = "text/css; charset=UTF-8"; break;
      case "txt": type = "text/plain; charset=UTF-8"; break;
      case "manifest": type = "text/cache-manifest; charset=UTF-8"; break;
      default: type = "application/octet-stream"; break;
    }
    fs.readFile(filename, function(err, content) {
      if (err) {
        response.writeHead(404, {
          "Content-Type": "text/plain; charset=UTF-8"
        })
        response.write(err.message);
        response.end()
      } else {
        response.writeHead(200, {
          "Content-Type": type
        });
        response.write(content);
        response.end();
      }
    })
  }
})

