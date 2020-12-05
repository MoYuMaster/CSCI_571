var http = require("http");
var fs = require("fs");

// http
//   .createServer(function(req, res) {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end("Hello World!");
//   })
//   .listen(8080);
const express = require("express");
const app = express(),
  bodyParser = require("body-parser");
port = 8080;

const axios = require("axios");

var path = require("path");
let token = "de4706a4d9291a99d177ca8b3184ad495b577c27";
let newsToken = "fb4fc641ee094944a9186328e84c7003";
const { response } = require("express");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("App Works !");
});

// Get data for auto complete
// Res: (name, ticker)
app.get("/getAutoData", (req, res) => {
  axios
    .get(
      "https://api.tiingo.com/tiingo/utilities/search?query=" +
        req.query.search +
        "&token=" +
        token
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
      "?token=" +
      token
  );
  const requestTwo = axios.get(
    "https://api.tiingo.com/iex/?tickers=" +
      req.query.search +
      "&token=" +
      token
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
        var utcTmp = new Date();
        var utcDate = new Date(utcTmp.toUTCString());
        utcDate.setHours(utcDate.getHours() - 8);
        var date = new Date(utcDate);
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
        // Get current Time //
        // Handle last time stamp and market status //
        let tmpLastTime = responseTwo.data[0].timestamp;
        let tmpdate = new Date(tmpLastTime);

        // let date = new Date(item.date);
        // time = Date.parse(date);
        // time = time - 8 * 3600 * 1000;
        let tmpParse = Date.parse(tmpdate);
        tmpParse = tmpParse - 8 * 3600 * 1000;
        let pstLastTime = new Date(tmpParse);
        Y2 = pstLastTime.getFullYear() + "-";
        M2 =
          (pstLastTime.getMonth() + 1 < 10
            ? "0" + (pstLastTime.getMonth() + 1)
            : pstLastTime.getMonth() + 1) + "-";
        D2 = ("0" + pstLastTime.getDate()).slice(-2) + " ";
        h2 = ("0" + pstLastTime.getHours()).slice(-2) + ":";
        m2 = ("0" + pstLastTime.getMinutes()).slice(-2) + ":";
        s2 = ("0" + pstLastTime.getSeconds()).slice(-2);
        let pstRealLast = Y2 + M2 + D2 + h2 + m2 + s2;

        // let localTime = tmpdate.toLocaleString("en-GB", {
        //   month: "2-digit",
        //   day: "2-digit",
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   second: "2-digit",
        //   timeZone: "America/Los_Angeles"
        // });
        // let lastTime =
        //   tmpLastTime.substring(0, 10) + " " + tmpLastTime.substring(11, 13);
        // Check Status //
        // PST to UTC //
        let backUTC = date;
        backUTC.setHours(backUTC.getHours() + 8);
        let marketStatus = parseInt(backUTC - tmpdate) / 1000 / 60 > 1 ? 0 : 1;
        // Map data //
        currMap["lastPrice"] = responseTwo.data[0].last.toFixed(2);
        currMap["change"] = change;
        currMap["changePer"] = changePer;
        currMap["currentTime"] = currentTime;
        currMap["lastTime"] = pstRealLast;
        currMap["marketStatus"] = marketStatus;
        res.json(currMap);
      })
    )
    .catch(error => {
      res.send("Get Detail Data Error. ");
    });
});

// Get data for Summary Tab
// include mid, askPirce, last, description ...
//         data for small daily chart
app.get("/getSummaryTabData", (req, res) => {
  const requestOne = axios.get(
    "https://api.tiingo.com/tiingo/daily/" +
      req.query.search +
      "?token=" +
      token
  );
  const requestTwo = axios.get(
    "https://api.tiingo.com/iex/?tickers=" +
      req.query.search +
      "&token=" +
      token
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
        currMap["high"] = responseTwo.data[0].high.toFixed(2);
        currMap["low"] = responseTwo.data[0].low.toFixed(2);
        currMap["open"] = responseTwo.data[0].open.toFixed(2);
        currMap["close"] = responseTwo.data[0].prevClose.toFixed(2);
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
        // Chart Data is no need in android app //
        // currMap["chartData"] = axios
        //   .get(
        //     "https://api.tiingo.com/iex/" +
        //       req.query.search +
        //       "/prices?startDate=" +
        //       lastWorkDay +
        //       "&resampleFreq=4min&columns=open,high,low,close,volume&token=" +
        //       token
        //   )
        //   .then(response => {
        //     // currMap["chartData"] = response.data;
        //     var arr = new Array();
        //     response.data.forEach(function(item) {
        //       var tmp = new Array();
        //       let date = new Date(item.date);
        //       time = Date.parse(date);
        //       time = time - 8 * 3600 * 1000;
        //       tmp.push(time);
        //       tmp.push(item.close);
        //       arr.push(tmp);
        //     });
        //     currMap["chartData"] = arr;
        //     res.json(currMap);
        //   });
        res.json(currMap);
      })
    )
    .catch(error => {
      console.error(errors);
    });
});

// Get News part data //
app.get("/getNewsTabData", (req, res) => {
  axios
    .get(
      "http://newsapi.org/v2/everything?q=" +
        req.query.search +
        "&apiKey=" +
        newsToken
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
        // currMap["id"] = "card" + tmpID++;
        // Date Handle //
        let originDate = Date.parse(item.publishedAt);
        // let realDate =
        //   monthsName[parseInt(originDate.substring(5, 7)) - 1] +
        //   " " +
        //   originDate.substring(8, 10) +
        //   ", " +
        //   originDate.substring(0, 4);
        currMap["date"] = originDate;
        arr.push(currMap);
      });
      res.json(arr);
    })
    .catch(error => {
      console.log(error);
    });
});

// Get data for big chart //
app.get("/getChartTabData", (req, res) => {
  axios
    .get(
      "https://api.tiingo.com/iex/?tickers=" +
        req.query.search +
        "&token=" +
        token
    )
    .then(response => {
      let lastTmp = response.data[0].timestamp;
      let twoYearDate =
        (Number(lastTmp.substring(0, 4)) - 2).toString() +
        "-" +
        lastTmp.substring(5, 7) +
        "-" +
        lastTmp.substring(8, 10);
      let currMap = new Map();
      axios
        .get(
          "https://api.tiingo.com/iex/aapl/prices?startDate=" +
            twoYearDate +
            "&resampleFreq=12Hour&columns=open,high,low,close,volume&token=" +
            token
        )
        .then(response => {
          var ohlcarr = new Array();
          var volumearr = new Array();
          response.data.forEach(function(item) {
            // Get data for ohlc //
            var ohlctmp = new Array();
            let date = new Date(item.date);
            // let time = date.toLocaleString("en-GB", {
            //   timeZone: "America/Los_Angeles"
            // });
            time = Date.parse(date);
            ohlctmp.push(time); // the date
            ohlctmp.push(item.open); // open
            ohlctmp.push(item.high); // high
            ohlctmp.push(item.low); // low
            ohlctmp.push(item.close); // close
            // Push tmp Array to big array for ohlcarr
            ohlcarr.push(ohlctmp);
            // Get data for volume //
            var volumetmp = new Array();
            volumetmp.push(time);
            volumetmp.push(item.volume);
            volumearr.push(volumetmp);
          });
          currMap["ohlc"] = ohlcarr;
          currMap["volume"] = volumearr;
          res.json(currMap);
        });
    });
});

// Send data to watch list route //
// For sort usage
app.get("/getWatchListData", (req, res) => {
  axios
    .get(
      "https://api.tiingo.com/iex/?tickers=" +
        req.query.search +
        "&token=" +
        token
    )
    .then(response => {
      var arr = new Array();
      // Create a array to sort ticker by name //
      let nameArray = new Array();
      for (let i = 0; i < response.data.length; ++i) {
        nameArray.push(response.data[i].ticker);
      }
      nameArray.sort();
      for (let j = 0; j < nameArray.length; ++j) {
        for (let realIdx = 0; realIdx < response.data.length; ++realIdx) {
          if (nameArray[j] == response.data[realIdx].ticker) {
            let currMap = new Map();
            currMap["ticker"] = response.data[realIdx].ticker;
            // Last, Change, ChangePercentage //
            currMap["last"] = response.data[realIdx].last;
            let change = (
              response.data[realIdx].last - response.data[realIdx].prevClose
            ).toFixed(2);
            let changePer = (
              (change * 100) /
              response.data[realIdx].prevClose
            ).toFixed(2);
            currMap["change"] = change;
            currMap["changePer"] = changePer;
            arr.push(currMap);
          }
        }
      }
      // response.data.forEach(function(item) {
      //   let currMap = new Map();
      //   currMap["ticker"] = item.ticker;
      //   // Last, Change, ChangePercentage //
      //   currMap["last"] = item.last;
      //   let change = (item.last - item.prevClose).toFixed(2);
      //   let changePer = ((change * 100) / item.prevClose).toFixed(2);
      //   currMap["change"] = change;
      //   currMap["changePer"] = changePer;
      //   arr.push(currMap);
      // });
      res.json(arr);
    });
});

// For sort usage
app.get("/getPortfolioData", (req, res) => {
  axios
    .get(
      "https://api.tiingo.com/iex/?tickers=" +
        req.query.search +
        "&token=" +
        token
    )
    .then(response => {
      var arr = new Array();
      // Sort
      // let nameArray = new Array();
      // for (let i = 0; i < response.data.length; ++i) {
      //   nameArray.push(response.data[i].ticker);
      // }
      // nameArray.sort();
      // for (let j = 0; j < nameArray.length; ++j) {
      //   for (let realIdx = 0; realIdx < response.data.length; ++realIdx) {
      //     if (nameArray[j] == response.data[realIdx].ticker) {
      //       let currMap = new Map();
      //       currMap["ticker"] = response.data[realIdx].ticker;
      //       // Last, Change, ChangePercentage //
      //       currMap["last"] = response.data[realIdx].last;
      //       let change = (
      //         response.data[realIdx].last - response.data[realIdx].prevClose
      //       ).toFixed(2);
      //       currMap["change"] = change;
      //       arr.push(currMap);
      //     }
      //   }
      // }
      response.data.forEach(function(item) {
        let currMap = new Map();
        currMap["ticker"] = item.ticker;
        currMap["last"] = item.last;
        let change = (item.last - item.prevClose).toFixed(2);
        currMap["change"] = change;
        arr.push(currMap);
      });
      res.json(arr);
    });
});

// Deploy Setting for frontend //
app.use("", express.static(path.join(__dirname, "dist/my-app")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/my-app/index.html"));
});
// Deploy Setting for frontend //

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
