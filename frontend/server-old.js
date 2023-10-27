const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({
  target: {
    host: "localhost",
    port: 4000,
  },
});
proxy.on("error", function (err, req, res) {
  console.log("proxy error : ", err, req.url, req.method);
  res.end("Something went wrong. And we are reporting a custom error message.");
});

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

const bootstrap = async () => {
  await app.prepare();

  const server = createServer({}, async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    if (pathname.startsWith("/api")) {
      proxy.web(req, res);
      // await app.render(req, res, pathname, query);
    } else {
      await app.render(req, res, pathname, query);
    }
  });

  server.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  server.on("upgrade", function (req, socket, head) {
    console.log("upgrade", req.url, req.method);
    proxy.ws(req, socket, head);
  });

  server.listen(port);
};

bootstrap();

// app.prepare().then(() => {
//   createServer(async (req, res) => {
//     try {
//       // Be sure to pass `true` as the second argument to `url.parse`.
//       // This tells it to parse the query portion of the URL.
//       const parsedUrl = parse(req.url, true);
//       const { pathname, query } = parsedUrl;
//       if (pathname.startsWith("/api") || pathname.startsWith("/socket.io")) {
//         proxy.web(req, res);
//       } else {
//         await app.render(req, res, pathname, query);
//       }
//       // if (pathname === "/a") {
//       //   await app.render(req, res, "/a", query);
//       // } else if (pathname === "/b") {
//       //   await app.render(req, res, "/b", query);
//       // } else {
//       //   await handle(req, res, parsedUrl);
//       // }
//     } catch (err) {
//       console.error("Error occurred handling", req.url, err);
//       res.statusCode = 500;
//       res.end("internal server error");
//     }
//   })
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://${hostname}:${port}`);
//     });
// });
