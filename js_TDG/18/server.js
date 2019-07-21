var http = require('http');

var clientui = require('fs').readFileSync("index.html");
var emulation = require('fs').readFileSync("code.js")
// var clientui = require('fs').readFileSync("chatclient.html");
// var emulation = require('fs').readFileSync("EventSourceEmulation.js")
// ServerResponse对象数组，用于接收发送的事件
var clients = [];

setInterval(function() {
  clients.forEach(function(client) {
    client.write(":ping?n");
  })
}, 20000);

var server = new http.Server();

server.on("request", function(request, response) {
  var url = require('url').parse(request.url);
  if (url.pathname === '/') {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.write("<script>" + emulation + "</script>")
    response.write(clientui)
    response.end()
    return
  } else if (url.pathname !== "/chat") {
    response.writeHead(404);
    response.end();
    return;
  }
  // post请求，就是客户端发送了一条新的消息
  if (request.method === "POST") {
    request.setEncoding("utf8");
    var body = "";
    // 获取到数据之后，将其添加到请求主体中
    request.on("data", function(chunk) {
      body += chunk
    })
    // 当请求完成时，发送一个空响应
    // 并将消息传播到所有处于监听状态的客户端中
    request.on("end", function() {
      response.writeHead(200);
      response.end();

      message = 'data: ' + body.replace('\n', '\ndata: ') + "\r\n\r\n";
      clients.forEach(function(client) {
        client.write(message)
      })
    })
  } else {
    response.writeHead(200, {'Content-Type': "text/event-stream"});
    response.write("data: Connected\n\n");

    // 如果客户端关闭连接，从活动客户端数组中删除对应的响应对象
    request.connection.on("end", function() {
      clients.splice(clients.indexOf(response), 1);
      response.end()
    })
    clients.push(response)
  }
})
server.listen(8000)
// node server.js
