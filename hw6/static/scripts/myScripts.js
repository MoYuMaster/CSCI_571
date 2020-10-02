function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;
  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function clearWeb() {
  // hide the bottom section
  document.getElementById("displaySetting").style.display = "none";
  document.getElementById("errorHint").style.display = "none";
}

function errorHappened() {
  // hide the display section, display error section
  document.getElementById("errorHint").style.display = "block";
  document.getElementById("displaySetting").style.display = "none";
}

//  Formate time from newsAPI
function formartTimeStamp(timeStamp, flag) {
  // validate date 2020-09-04T1
  let year = timeStamp.substring(0, 4);
  let mon = timeStamp.substring(5, 7);
  let day = timeStamp.substring(8, 10);
  if (flag == 2) {
    return year + "-" + mon + "-" + day;
  } else if (flag == 4) {
    return day + "/" + mon + "/" + year;
  }
}

// Search based on keywords
function search() {
  document.getElementById("errorHint").style.display = "none";
  // Read the keyword, Create URL, Send Request
  let key = document.getElementById("keyWord").value.toUpperCase();
  // if key does not exist, return
  if (key == null || key.length == 0) return;
  // display
  let newsUrl = "/news/" + key;
  let outlookUrl = "/tiingo/outlook/" + key;
  let summaryUrl = "/tiingo/summary/" + key;
  let chartUrl = "/tiingo/highcharts/" + key;
  // 4 Tab sction
  searchNews(newsUrl);
  searchOutlook(outlookUrl);
  searchSummary(summaryUrl);
  // buildHighChart(chartUrl);
  buildChart(chartUrl, key);
  // If error not happend, dont display
  if (document.getElementById("errorHint").style.display != "block") {
    document.getElementById("displaySetting").style.display = "block";
    document.getElementById("defaultOpen").click();
  }
}

// 1. Outlook Search
function searchOutlook(outlookUrl) {
  let request = new XMLHttpRequest();
  try {
    // Send request to server with url
    request.open("GET", outlookUrl, false);
    request.send(null);
    if (request.readyState == 4 && request.status == 200) {
      let outlookJson = JSON.parse(request.responseText);
      document.getElementById("cName").innerHTML = outlookJson.name;
      document.getElementById("tSymbol").innerHTML = outlookJson.ticker;
      document.getElementById("code").innerHTML = outlookJson.exchangeCode;
      document.getElementById("date").innerHTML = outlookJson.startDate;
      document.getElementById("desc").innerHTML = outlookJson.description;
    }
  } catch (e) {
    errorHappened();
  }
}

// 2. Summary Search
function changeCheck(value, flag) {
  if (value < 0) flag = -1;
  if (value > 0) flag = 1;
}

function upDownCheck(num, imgID) {
  if (num - 0 > 0) {
    document.getElementById(imgID).src =
      "https://csci571.com/hw/hw6/images/GreenArrowUp.jpg";
  }
}

function searchSummary(summaryUrl) {
  let request = new XMLHttpRequest();
  try {
    // Send request to server with url
    request.open("GET", summaryUrl, false);
    request.send(null);
    if (request.readyState == 4 && request.status == 200) {
      let summaryArray = JSON.parse(request.responseText);
      let summaryJson = summaryArray[0];
      // Clean the data: timestamp
      // Change = (last - prevClose)
      // Change Percent = (Change / prevClose) * 100
      let changeTag = 0,
        changePercentTag = 0;
      let time = formartTimeStamp(summaryJson.timestamp, 2);
      let change = summaryJson.last - summaryJson.prevClose;
      let changePercent = (change / summaryJson.prevClose) * 100;
      change = change.toFixed(2);
      changePercent = changePercent.toFixed(2);
      // Check change and changePercent
      changeCheck(change, changeTag);
      changeCheck(changePercent, changePercentTag);
      // Replace Data
      document.getElementById("2tSymbol").innerHTML = summaryJson.ticker;
      document.getElementById("tradingD").innerHTML = time;
      document.getElementById("closingP").innerHTML = summaryJson.prevClose;
      document.getElementById("openingP").innerHTML = summaryJson.open;
      document.getElementById("highP").innerHTML = summaryJson.high;
      document.getElementById("lowPrice").innerHTML = summaryJson.low;
      document.getElementById("lastP").innerHTML = summaryJson.last;
      document.getElementById("change").innerHTML = change;
      upDownCheck(change, "up1");
      document.getElementById("changePercent").innerHTML = changePercent + "%";
      upDownCheck(changePercent, "up2");
      document.getElementById("numberShare").innerHTML = summaryJson.volume;
    }
  } catch (e) {
    errorHappened();
  }
}

// 3. Charts Build
function buildChart(chartUrl, keyWord) {
  let request = new XMLHttpRequest();
  try {
    // Send request to server with url
    request.open("GET", chartUrl, false);
    request.send(null);
    if (request.readyState == 4 && request.status == 200) {
      // alert(request.responseText);
      let chartArray = JSON.parse(request.responseText);
      //
      chartTab = document.createElement("div");
      // chartTab.id = "chartTab";
      // chartTab.setAttribute("class", "tabcontent");
      //
      Charts = document.createElement("div");
      Charts.id = "charts";
      Charts.setAttribute("class", "outlook tabcontent");
      Charts.setAttribute("style", "height:555px");
      // get nowDate
      var myDate = new Date();
      let nowDate =
        myDate.getFullYear() +
        "-" +
        (myDate.getMonth() + 1) +
        "-" +
        myDate.getDate();
      // Add child node
      document.getElementById("displaySetting").appendChild(Charts);
      Highcharts.stockChart("charts", {
        chart: { zoomType: "x", spacingTop: 20 },
        title: {
          text: "Stock Price " + "keyWord " + nowDate,
          style: { fontSize: "23px" }
        },
        subtitle: {
          text:
            '<a href="https://api.tiingo.com/" target="_blank">Source: Tiingo</a>',
          style: { fontSize: "16px" },
          useHTML: true
        },
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats: {
            second: "%e. %b",
            minute: "%e. %b",
            hour: "%e. %b",
            day: "%e. %b",
            week: "%e. %b",
            month: "%e. %b",
            year: "%e. %b"
          },
          ordinal: true,
          labels: { style: { fontSize: "15px" } },
          tickPixelInterval: 140
        },
        yAxis: [
          {
            title: {
              text: "Stock Price",
              style: { fontSize: "15px" },
              x: 8,
              margin: 20
            },
            labels: { style: { fontSize: "15px" } },
            opposite: false,
            softMin: 0,
            tickAmount: 4
          },
          {
            title: {
              text: "Volume",
              style: { fontSize: "15px" },
              x: -4,
              margin: 20
            },
            labels: { style: { fontSize: "15px" } },
            opposite: true,
            softMin: 0,
            tickAmount: 4
          }
        ],
        rangeSelector: {
          buttons: [
            { type: "day", count: 7, text: "7d" },
            { type: "day", count: 15, text: "15d" },
            { type: "month", count: 1, text: "1m" },
            { type: "month", count: 3, text: "3m" },
            { type: "month", count: 6, text: "6m" }
          ],
          selected: 4,
          inputEnabled: false,
          verticalAlign: "top",
          buttonTheme: {
            width: 42,
            height: 25,
            style: { fontSize: "18px", fontWeight: "bold" }
          },
          labelStyle: { fontSize: "18px" },
          buttonSpacing: 7
        },
        series: [
          { name: keyWord, type: "area", yAxis: 0, data: chartArray[0] },
          {
            name: keyWord + " Volume",
            type: "column",
            yAxis: 1,
            data: chartArray[1]
          }
        ],
        navigation: {
          buttonOptions: {
            height: 40,
            width: 40,
            symbolX: 20,
            symbolY: 12,
            symbolSize: 20,
            symbolStrokeWidth: 5
          }
        },
        navigator: { height: 58, margin: 36 },
        plotOptions: {
          series: {
            pointPlacement: "on",
            pointWidth: 3,
            getExtremesFromAll: true,
            findNearestPointBy: "x",
            label: { connectorAllowed: false }
          },
          area: {
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                  1,
                  Highcharts.color(Highcharts.getOptions().colors[0])
                    .setOpacity(0)
                    .get("rgba")
                ]
              ]
            }
          },
          column: { color: "#363636" }
        }
      });
    }
  } catch (e) {
    errorHappened();
  }
}

// 4.  News search
function searchNews(newsUrl) {
  let request = new XMLHttpRequest();
  try {
    // Send request to server with url
    request.open("GET", newsUrl, false);
    request.send(null);
    if (request.readyState == 4 && request.status == 200) {
      let newsArray = JSON.parse(request.responseText);
      // alert(newsArray);
      // We only get 5 news from server
      for (i = 0; i < 5; ++i) {
        let news = newsArray[i];
        let time = formartTimeStamp(news.date, 4);
        document.getElementById("t" + (i + 1)).innerHTML = news.title;
        document.getElementById("img" + (i + 1)).src = news.img;
        document.getElementById("d" + (i + 1)).innerHTML =
          "Published Date: " + time;
        document.getElementById("u" + (i + 1)).href = news.url;
      }
    }
  } catch (e) {
    errorHappened();
  }
}
