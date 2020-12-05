package com.example.stocks;

public class Stock {
    String ticker;
    String nameOrShares;
    String currentPrice;
    String change;

    Stock(String ticker, String nameOrShares, String currentPrice, String change) {
        this.ticker = ticker;
        this.nameOrShares = nameOrShares;
        this.currentPrice = currentPrice;
        this.change = change;
    }
}
