var http = require('http');
var ws = require('websocket-server');

var clientui = require('fs').readFileSync("ws.html");

var httpserver = new http.Server();
httpserver.on("request", function(request, response) {
  if (request.url === "/") {
    response.writeHead(200, {"Content-Ty[e": "test/html"});
    response.write(clientui);
    response.end();
  } else {
    response.writeHead(404);
    response.end();
  }
});

var wsserver = ws.createServer({server: httpserver});

wsserver.on("connection", function(socket) {
  socket.send("Welcome to the chat room.");
  socket.on("message", function(msg) {
    wsserver.broadcast(msg)
  })
})

wsserver.listen(8000);