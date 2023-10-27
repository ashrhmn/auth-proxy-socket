const http = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({
  target: {
    host: "localhost",
    port: 4000,
  },
});

proxy.on("error", function (err, req, res) {
  console.log(err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Something went wrong. And we are reporting a custom error message.");
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on("upgrade", function (req, socket, head) {
  proxy.ws(req, socket, head);
});

server.listen(8080);
