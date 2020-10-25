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

const axios = require("axios");

var path = require("path");
const { response } = require("express");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("App Works !");
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

// Get data for auto complete //
app.get("/getAutoData", (req, res) => {
  axios
    .get(
      "https://api.tiingo.com/tiingo/utilities/search?query=" +
        req.query.search +
        "&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
    )
    .then(response => {
      var arr = Array();
      response.data.forEach(function(item) {
        let currMap = new Map();
        currMap["name"] = item.name;
        currMap["ticker"] = item.ticker;
        arr.push(currMap);
      });
      res.json(arr);
    })
    .catch(error => {
      console.log(error);
    });
});

// Get data for detail page //
// • Symbol, company name, trading Exchange (such as NASS+DAQ), and Buy button on top
// left;
// • Last price, change, percent change, and date/time, on top right. The change items should
// be preceded by appropriately colored arrows);
// • Indication of open / closed market;
// • Summary, Top News and Charts tabs.

app.get("/getDetailData", (req, res) => {
  const requestOne = axios.get(
    "https://api.tiingo.com/tiingo/daily/" +
      req.query.search +
      "?token=de4706a4d9291a99d177ca8b3184ad495b577c27"
  );
  const requestTwo = axios.get(
    "https://api.tiingo.com/iex/?tickers=" +
      req.query.search +
      "&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
  );
  axios
    .all([requestOne, requestTwo])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];
        // Handle data from Meta API //
        let currMap = new Map();
        currMap["name"] = responseOne.data.name;
        currMap["ticker"] = responseOne.data.ticker;
        currMap["exchangeCode"] = responseOne.data.exchangeCode;
        //  Handle data from IEX Api //
        let change = (
          responseTwo.data[0].last - responseTwo.data[0].prevClose
        ).toFixed(2);
        let changePer = (
          (change * 100) /
          responseTwo.data[0].prevClose
        ).toFixed(2);
        // Get current Time //
        var date = new Date();
        Y = date.getFullYear() + "-";
        M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        D = ("0" + date.getDate()).slice(-2) + " ";
        h = ("0" + date.getHours()).slice(-2) + ":";
        m = ("0" + date.getMinutes()).slice(-2) + ":";
        s = ("0" + date.getSeconds()).slice(-2);
        let currentTime = Y + M + D + h + m + s;
        // Handle last time stamp and market status //
        let tmpLastTime = responseTwo.data[0].timestamp;
        let lastTime =
          tmpLastTime.substring(0, 10) + " " + tmpLastTime.substring(11, 19);
        let marketStatus = responseTwo.data[0].bidPrice == null ? 0 : 1;
        // Map data //
        currMap["lastPrice"] = responseTwo.data[0].last;
        currMap["change"] = change;
        currMap["changePer"] = changePer;
        currMap["currentTime"] = currentTime;
        currMap["lastTime"] = lastTime;
        currMap["marketStatus"] = marketStatus;
        res.json(currMap);
      })
    )
    .catch(error => {
      console.error(errors);
    });
});
