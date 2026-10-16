const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");

  if (req.url === "/") {
    fs.readFile("data.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end("Internal Server Error while reading the file");
        return;
      }
      res.write(`
            <h2 id="display">${data}</h2><br>
            <form action="/submit" method="POST">
            <input type="text" id="inputField" name="inputField" placeholder="Enter something...">
            <button type="submit">Submit</button>
            </form>
        `);
      res.end();
    });
  } else if (req.url === "/submit" && req.method === "POST") {
    const recieved = [];
    req.on("data", (chunk) => {
      recieved.push(chunk.toString());
    });

    req.on("end", () => {
      const formData = recieved.join("");
      const inputData = formData.split("=")[1];
      fs.writeFile("data.txt", inputData, (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end("Internal Server Error while writing to the file");
          return;
        }
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
