const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");

  if (req.url === "/") {
    res.end("<h1>Welcome to the Home Page</h1>");
  } else {
    res.statusCode = 404;
    res.end("<h1>404 Not Found</h1>");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
