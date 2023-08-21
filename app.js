const express = require("express");
const cron = require("node-cron");

const uploadRoute = require("./routes/upload.route");
const { filesList } = require("./utils/helper.util");

const app = express();
const PORT = 3000;
var syncCron = {
  running: true,
};
cron.schedule("0 */15 * * * *", async function () {
  console.log("---------------------", syncCron);
  if (syncCron.running) await filesList(syncCron);
  // running = false;
  console.log("running a task every 60 seconds");
});

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
