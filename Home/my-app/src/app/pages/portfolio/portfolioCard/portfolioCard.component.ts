import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-portfolioCard',
  templateUrl: './portfolioCard.component.html',
  styleUrls: ['./portfolioCard.component.css']
})
export class PortfolioCardComponent implements OnInit {
  @Input() portfolioCardData: any;
  @Output() newItemEvent = new EventEmitter<number>();

  portCardKey: string;
  total: any;
  sellKey: string;
  status: any;
  constructor() {}

  ngOnInit(): void {
    this.total = 0;
    this.portCardKey = this.portfolioCardData.ticker + 'buy';
    this.sellKey = this.portfolioCardData.ticker + 'sell';

    // Color Change Check //
    let char = this.portfolioCardData.change.charAt(0);
    if (char == '-') {
      this.status = -1;
    } else {
      let test = this.portfolioCardData.change.substr(1);
      if (test == '0.00') {
        this.status = 0;
      } else {
        this.status = 1;
      }
    }
  }

  portBuy() {
    let searchKey = '_' + this.portfolioCardData.ticker;
    // Update local Storage //
    let tmpObj = JSON.parse(localStorage.getItem(searchKey));
    tmpObj.num += this.total;
    let tmpCost = Number(
      tmpObj.totalCost +
        this.total * Number(this.portfolioCardData.last.toFixed(2))
    );
    tmpObj.totalCost = tmpCost;
    localStorage.setItem(searchKey, JSON.stringify(tmpObj));
    // Update Card
    this.portfolioCardData.num = tmpObj.num;
    this.portfolioCardData.totalCost = tmpObj.totalCost;
  }

  portSell() {
    let searchKey = '_' + this.portfolioCardData.ticker;
    // Update local Storage //
    let tmpObj = JSON.parse(localStorage.getItem(searchKey));
    tmpObj.num -= this.total;
    console.log(
      this.total *
        Number(
          (
            this.portfolioCardData.totalCost / this.portfolioCardData.num
          ).toFixed(2)
        )
    );
    let tmpCost =
      tmpObj.totalCost -
      this.total *
        Number(
          (
            this.portfolioCardData.totalCost / this.portfolioCardData.num
          ).toFixed(2)
        );
    tmpObj.totalCost = tmpCost.toFixed(2);
    if (tmpObj.num == 0) {
      localStorage.removeItem(searchKey);
    } else {
      localStorage.setItem(searchKey, JSON.stringify(tmpObj));
    }
    // Update Card
    this.portfolioCardData.num = tmpObj.num;
    this.portfolioCardData.totalCost = tmpObj.totalCost;
    // Buy list Check //
    let buyNum = 0;
    for (var i = 0; i < localStorage.length; i++) {
      // set iteration key name
      var key = localStorage.key(i);
      if (key.charAt(0) == '_') {
        buyNum++;
      }
    }
    if (buyNum == 0) {
      this.newItemEvent.emit(1);
    }
  }
}
