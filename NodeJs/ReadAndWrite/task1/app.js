const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (req.url === "/") {
    res.end(`
            <form action="/message" method="POST">
            <input type="text" name="username" placeholder="Enter your name" required>
            <button type="submit">Submit</button>
            </form>
        `);
  } else if (req.url.startsWith("/message")) {
    let dataChunks = [];
    req.on("data", (chunk) => {
      dataChunks.push(chunk);
    });
    req.on("end", () => {
      const parsedData = Buffer.concat(dataChunks).toString();
      const username = parsedData.split("=")[1];

      fs.writeFile("formValues.txt", username, (err) => {
        res.statusCode = 302; //redirecting to the home page after writing the data to the file
        res.setHeader("Location", "/");
        res.end();
      });
    });
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
