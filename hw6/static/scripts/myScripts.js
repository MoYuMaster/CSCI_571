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
function formartTimeStamp(timeStamp) {
  // validate date 2020-09-04T1
  let year = timeStamp.substring(0, 4);
  let mon = timeStamp.substring(5, 7);
  let day = timeStamp.substring(8, 10);
  return day + "/" + mon + "/" + year;
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
  searchNews(newsUrl);
  searchOutlook(outlookUrl);
}

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

function searchNews(newsUrl) {
  let request = new XMLHttpRequest();
  try {
    // Send request to server with url
    request.open("GET", newsUrl, false);
    request.send(null);
    if (request.readyState == 4 && request.status == 200) {
      let newsArray = JSON.parse(request.responseText);
      // We only get 5 news from server
      for (i = 0; i < 5; ++i) {
        let news = newsArray[i];
        let time = formartTimeStamp(news.date);
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
