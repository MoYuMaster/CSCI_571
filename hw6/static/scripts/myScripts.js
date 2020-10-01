let priceArray;
let dataTest = [
  [1589929200000, 120.25],
  [1590015600000, 121.405],
  [1590102000000, 119.13]
];

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
  // Read the keyword, Create URL, Send Request
  let key = document.getElementById("keyWord").value.toUpperCase();
  // if key does not exist, return
  if (key == null || key.length == 0) return;
  // display
  document.getElementById("displaySetting").style.display = "block";
  let newsUrl = "/news/" + key;
  let outlookUrl = "/tiingo/outlook/" + key;
  let summaryUrl = "/tiingo/summary/" + key;
  let chartUrl = "/tiingo/highcharts/" + key;
  searchNews(newsUrl);
  searchOutlook(outlookUrl);
  searchSummary(summaryUrl);
  buildHighChart(chartUrl);
}

// Outlook Search
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
    alert(e);
  }
}

// Summary Search
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
    alert(e);
  }
}
// Build HighChart
function buildHighChart(chartUrl) {
  let request = new XMLHttpRequest();
  try {
    // Send request to server with url
    request.open("GET", chartUrl, false);
    request.send(null);
    if (request.readyState == 4 && request.status == 200) {
      // alert(request.responseText);
      let newsArray = JSON.parse(request.responseText);
      console.log(newsArray[0]);
      // We only get 5 news from server
      // alert(newsArray);
      priceArray = newsArray[0];
      ////
      document.addEventListener("click", function() {
        // create the chart
        // let dataTest = [[1589929200000, 120.25],[1590015600000, 121.405],[1590102000000, 119.13]];

        let realData = newsArray[0];
        Highcharts.stockChart("container", {
          title: {
            text: "AAPL stock price by minute"
          },

          subtitle: {
            text: "Using ordinal X axis"
          },

          xAxis: {
            gapGridLineWidth: 0
          },

          rangeSelector: {
            buttons: [
              {
                type: "day",
                count: 7,
                text: "7d"
              },
              {
                type: "day",
                count: 15,
                text: "15d"
              },
              {
                type: "mouth",
                count: 1,
                text: "1m"
              },
              {
                type: "mouth",
                count: 3,
                text: "3m"
              },
              {
                type: "mouth",
                count: 6,
                text: "6m"
              }
            ],
            selected: 1,
            inputEnabled: false
          },

          series: [
            {
              name: "AAPL",
              type: "area",
              data: realData,
              gapSize: 2,
              tooltip: {
                valueDecimals: 2
              },
              fillColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
                },
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [
                    1,
                    Highcharts.color(Highcharts.getOptions().colors[0])
                      .setOpacity(0)
                      .get("rgba")
                  ]
                ]
              },
              threshold: null
            }
          ]
        });
      });
    }
  } catch (e) {
    alert(e);
  }
}

function passPriceArray() {
  return priceArray;
}

// News search
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
    alert(e);
  }
}
