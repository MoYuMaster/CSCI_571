var http = require("http");
var fs = require("fs");

http
  .createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello World!");
  })
  .listen(8080);
const express = require("express");
const app = express(),
  bodyParser = require("body-parser");
port = 3080;

const users = [];
const axios = require("axios");

app.use(bodyParser.json());

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/user", (req, res) => {
  const user = req.body.user;
  users.push(user);
  res.json("user addedd");
});

app.get("/", (req, res) => {
  res.send("App Works !!!!!~~!");
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

app.get("/getAutoData", (req, res) => {
  // res.send(
  //   "https://api.tiingo.com/tiingo/utilities/search?query=" +
  //     req.query.search +
  //     "&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
  // );
  axios
    .get(
      "https://api.tiingo.com/tiingo/utilities/search?query=" +
        req.query.search +
        "&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
    )
    .then(response => {
      var arr = Array();
      response.data.forEach(function(item) {
        console.log(item.name);
        console.log(item.ticker);
        let currMap = new Map();
        currMap["name"] = item.name;
        currMap["ticker"] = item.ticker;
        arr.push(currMap);
      });
      console.log("arr", arr);
      res.json(arr);
    })
    .catch(error => {
      console.log(error);
    });
});
