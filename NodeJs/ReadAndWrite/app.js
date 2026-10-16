const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (req.url === "/") {
    res.end(`
            <form action="/message">
            <input type="text" name="username" placeholder="Enter your name" required>
            <button type="submit">Submit</button>
            </form>
        `);
  } else if (req.url.startsWith("/message")) {
    res.end("<h1>Welcome to the Message Page!</h1>\n");
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
