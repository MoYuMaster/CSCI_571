import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolioCard',
  templateUrl: './portfolioCard.component.html',
  styleUrls: ['./portfolioCard.component.css']
})
export class PortfolioCardComponent implements OnInit {
  @Input() portfolioCardData: any;
  portCardKey: string;
  total: any;
  sellKey: string;
  constructor() {}

  ngOnInit(): void {
    this.total = 0;
    this.portCardKey = this.portfolioCardData.ticker + 'buy';
    this.sellKey = this.portfolioCardData.ticker + 'sell';
  }

  portBuy() {
    let searchKey = '_' + this.portfolioCardData.ticker;
    // Update local Storage //
    let tmpObj = JSON.parse(localStorage.getItem(searchKey));
    tmpObj.num += this.total;
    console.log('buy');
    console.log(this.total * Number(this.portfolioCardData.last.toFixed(2)));
    let tmpCost =
      tmpObj.totalCost +
      this.total * Number(this.portfolioCardData.last.toFixed(2));
    tmpObj.totalCost = tmpCost.toFixed(2);
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
    localStorage.setItem(searchKey, JSON.stringify(tmpObj));
    // Update Card
    this.portfolioCardData.num = tmpObj.num;
    this.portfolioCardData.totalCost = tmpObj.totalCost;
  }
}
