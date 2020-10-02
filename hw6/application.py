# tiingoClient = TiingoClient(api_key='de4706a4d9291a99d177ca8b3184ad495b577c27')
# newsAPi: 9a31a38a293a4d93a8b8c60250e2dbd9
import requests
from datetime import datetime
from dateutil.relativedelta import relativedelta
from tiingo import TiingoClient
from newsapi import NewsApiClient
from flask import Flask, request, jsonify, json

tiingoApi = TiingoClient({"api_key": "de4706a4d9291a99d177ca8b3184ad495b577c27"})
newsApi = NewsApiClient(api_key='9a31a38a293a4d93a8b8c60250e2dbd9')
application = Flask(__name__, static_url_path='')
application.debug = True

def isValid(item):
    if item is not None and len(item) > 0:
        return True
    return False

# UTC: 2020-10-01T05:44:55Z
# 2020-05-22T17:00:00.000Z
def utcToTimestamp(utc):
    dt_object1 = datetime.strptime(utc, "%Y-%m-%dT%H:%M:%S.000Z")
    tmpTimestamp = str(dt_object1.timestamp()) 
    finalTimestamp = tmpTimestamp.replace(".","0") + "0"
    return int(finalTimestamp)

@application.route('/', methods=['GET'])
def index():
    return application.send_static_file('html/index.html')

@application.route('/tiingo/outlook/<keyWord>', methods=['GET'])
def getOutlookData(keyWord):
    meta = tiingoApi.get_ticker_metadata(keyWord)
    return meta

@application.route('/tiingo/summary/<keyWord>', methods=['GET'])
def getSummaryData(keyWord):
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.get("https://api.tiingo.com/iex/?tickers=" + keyWord + "&token=de4706a4d9291a99d177ca8b3184ad495b577c27", headers=headers)
    iexData = jsonify(response.json())
    return iexData

# 5 values : 
# keyword, 
# token: de4706a4d9291a99d177ca8b3184ad495b577c27
# startDate:
# columns: open, high, low and close prices and volume, 
# resampleFreq: indicates in hours the resampling frequency. See the Tiingo
# documentation for allowed values.
@application.route('/tiingo/highcharts/<keyWord>', methods=['GET'])
def getChartData(keyWord):
    # 2020-03-30
    startDate = datetime.today() +  relativedelta(months=-6)
    # Make request to tiingo
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.get("https://api.tiingo.com/iex/"+ keyWord +"/prices?startDate=" + startDate.strftime("%Y-%m-%d") +"&resampleFreq=12hour&columns=close,volume&token=de4706a4d9291a99d177ca8b3184ad495b577c27", headers=headers)
    dataJson = response.json()
    priceArray=[]
    volumeArray=[]
    for singleDate in dataJson:
        dateTimeStamp = utcToTimestamp(singleDate['date'])
        priceArray.append([dateTimeStamp,  singleDate['close']])
        volumeArray.append([dateTimeStamp,  singleDate['volume']])
    res = []
    res.append(priceArray)
    res.append(volumeArray)
    return jsonify(res)

@application.route('/news/<keyWord>', methods=['GET'])
def getNewsData(keyWord):
    news = newsApi.get_everything(q=keyWord)
    news = news['articles']
    num = 0
    res = []
    for article in news:
        if isValid(article['title']) and isValid(article['url']) and isValid(article['urlToImage']) \
            and isValid('publishedAt'):
            num += 1
            n1 = {'img':article['urlToImage'],'title':article['title'],'url':article['url'], 'date':article['publishedAt']}
            res.append(n1)
            if num == 5:
                break
    return jsonify(res) 

if __name__ == '__main__':
    application.run(debug=True)
