const open = require("open");

const express = require("express");

const app = express();

app.get("/open", (req, res) => {
  open("http://google.com");
});
app.get("/check/:browser/:url", (req, res) => {
  console.log("client connection established");
  let browser = req.params.browser;
  let url = req.params.url;

  open(url, { app: { name: browser } });
});
app.listen(3000, () => {
  console.log("Client running");
});
