const express = require("express");

const server = express();

server.listen(3000, () => {
  console.log(
    "Server is up and running on port 3000! Ready to handle requests.",
  );
});
