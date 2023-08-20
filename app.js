const express = require("express");
const uploadRoute = require("./routes/upload.route");

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  console.log("file is called");
  res.json("Server is active");
});

//upload route
app.use("/upload", uploadRoute);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port: " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
