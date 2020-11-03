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
        currMap["lastPrice"] = responseTwo.data[0].last.toFixed(2);
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

app.get("/getSummaryTabData", (req, res) => {
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
  // const requestThree = axios.get(
  //   "https://api.tiingo.com/iex/aapl/prices?startDate=2019-01-02&resampleFreq=5min&columns=open,high,low,close,volume&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
  // );
  axios
    .all([requestOne, requestTwo])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];
        // const responseThree =responses[2]

        let currMap = new Map();
        let marketStatus = responseTwo.data[0].bidPrice == null ? 0 : 1;
        //  Details part //
        currMap["marketStatus"] = marketStatus;
        if (marketStatus == 1) {
          currMap["mid"] = responseTwo.data[0].mid;
          currMap["askPrice"] = responseTwo.data[0].askPrice;
          currMap["askSize"] = responseTwo.data[0].askSize;
          currMap["bidPrice"] = responseTwo.data[0].bidPrice;
          currMap["bidSize"] = responseTwo.data[0].bidSize;
        }
        currMap["high"] = responseTwo.data[0].high;
        currMap["low"] = responseTwo.data[0].low.toFixed(2);
        currMap["open"] = responseTwo.data[0].open;
        currMap["close"] = responseTwo.data[0].prevClose;
        currMap["volume"] = responseTwo.data[0].volume;
        //  Company's Description //
        currMap["startDate"] = responseOne.data.startDate;
        currMap["description"] = responseOne.data.description;
        currMap["ticker"] = responseOne.data.ticker;
        // Chart;
        let lastTmp = responseTwo.data[0].timestamp;
        let lastWorkDay =
          lastTmp.substring(0, 4) +
          "-" +
          lastTmp.substring(5, 7) +
          "-" +
          lastTmp.substring(8, 10);
        currMap["chartData"] = axios
          .get(
            "https://api.tiingo.com/iex/" +
              req.query.search +
              "/prices?startDate=" +
              lastWorkDay +
              "&resampleFreq=4min&columns=open,high,low,close,volume&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
          )
          .then(response => {
            // currMap["chartData"] = response.data;
            var arr = new Array();
            response.data.forEach(function(item) {
              var tmp = new Array();
              let date = new Date(item.date);
              let time = date.toLocaleDateString("en-GB", {
                timeZone: "America/Los_Angeles"
              });
              tmp.push(time);
              tmp.push(item.close);
              arr.push(tmp);
            });
            currMap["chartData"] = arr;
            res.json(currMap);
          });
      })
    )
    .catch(error => {
      console.error(errors);
    });
});

app.get("/getNewsTabData", (req, res) => {
  axios
    .get(
      "http://newsapi.org/v2/everything?q=" +
        req.query.search +
        "&apiKey=9a31a38a293a4d93a8b8c60250e2dbd9"
    )
    .then(response => {
      var monthsName = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      var arr = new Array();
      let tmpID = 0;
      response.data.articles.forEach(function(item) {
        let currMap = new Map();
        currMap["img"] = item.urlToImage;
        currMap["title"] = item.title;
        currMap["publisher"] = item.source.name;
        currMap["description"] = item.description;
        currMap["url"] = item.url;
        currMap["id"] = "card" + tmpID++;
        // Date Handle //
        let originDate = item.publishedAt;
        let realDate =
          monthsName[parseInt(originDate.substring(5, 7)) - 1] +
          " " +
          originDate.substring(8, 10) +
          ", " +
          originDate.substring(0, 4);
        currMap["date"] = realDate;
        arr.push(currMap);
      });
      res.json(arr);
    })
    .catch(error => {
      console.log(error);
    });
});

app.get("/getChartTabData", (req, res) => {
  axios
    .get(
      "https://api.tiingo.com/iex/?tickers=" +
        req.query.search +
        "&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
    )
    .then(response => {
      let lastTmp = response.data[0].timestamp;
      let twoYearDate =
        (Number(lastTmp.substring(0, 4)) - 2).toString() +
        "-" +
        lastTmp.substring(5, 7) +
        "-" +
        lastTmp.substring(8, 10);
      axios
        .get(
          "https://api.tiingo.com/iex/aapl/prices?startDate=" +
            twoYearDate +
            "&resampleFreq=8Hour&columns=open,high,low,close,volume&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
        )
        .then(data => {
          res.send(data.data);
        });
    });
});

// Send data to watch list route //
app.get("/getWatchListData", (req, res) => {
  axios
    .get(
      "https://api.tiingo.com/iex/?tickers=" +
        req.query.search +
        "&token=de4706a4d9291a99d177ca8b3184ad495b577c27"
    )
    .then(response => {
      console.log(response.data);
      var arr = new Array();
      response.data.forEach(function(item) {
        let currMap = new Map();
        currMap["ticker"] = item.ticker;
        // Last, Change, ChangePercentage //
        currMap["last"] = item.last;
        let change = (item.last - item.prevClose).toFixed(2);
        let changePer = ((change * 100) / item.prevClose).toFixed(2);
        currMap["change"] = change;
        currMap["changePer"] = changePer;
        arr.push(currMap);
      });
      res.json(arr);
    });
});
