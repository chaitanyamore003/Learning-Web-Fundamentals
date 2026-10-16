const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");

  res.statusCode = 200;
  if (req.url === "/") {
    res.end("<h1>Hello, World!</h1>\n");
  } else if (req.url === "/pizza") {
    res.end("<h1>This is Your Pizza!</h1>\n");
  } else if (req.url === "/home") {
    res.end("<h1>Welcome Home!</h1>\n");
  } else if (req.url === "/about") {
    res.end("<h1>Welcome to About Us</h1>\n");
  } else if (req.url === "/node") {
    res.end("<h1>Welcome to My Node Js Project</h1>\n");
  } else {
    res.statusCode = 404;
    res.end(`<h1>404 Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <p><a href="/">Go back to Home</a></p>`);
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
