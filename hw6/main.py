# from tiingo import TiingoClient

# tiingoClient = TiingoClient(api_key='de4706a4d9291a99d177ca8b3184ad495b577c27')
# newsAPi: 9a31a38a293a4d93a8b8c60250e2dbd9

from newsapi import NewsApiClient
from flask import Flask, request, jsonify, json

newsApi = NewsApiClient(api_key='9a31a38a293a4d93a8b8c60250e2dbd9')
app = Flask(__name__, static_url_path='')
app.debug = True

def isValid(item):
    if item is not None and len(item) > 0:
        return True
    return False

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('html/index.html')

@app.route('/fishing', methods=['GET'])
def wuhu():
    return 'wuhu'

@app.route('/news/<keyWord>', methods=['GET'])
def getData(keyWord):
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
    app.run(debug=True)
