package com.example.stocks;

class News {
    String imgUrl;
    String title;
    String source;
    String timeForNews;
    String urlForNews;

    News(String imgUrl, String title, String source, String timeForNews, String urlForNews) {
        this.imgUrl = imgUrl;
        this.title = title;
        this.source = source;
        this.timeForNews = timeForNews;
        this.urlForNews = urlForNews;
    }
}
