import { Component, OnInit } from '@angular/core';
import { PortfolioService } from './portfolio.service';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  constructor(private portfolioService: PortfolioService) {}
  searchPortfolio: any;
  portData: any;
  wuhu: any;
  isEmpty: any;

  ngOnInit(): void {
    this.searchPortfolio = '';
    // Load Part
    function hideloader() {
      document.getElementById('portLoad').style.display = 'none';
      // console.log('change main display');
      document.getElementById('portMain').style.display = 'block';
    }

    for (var i = 0; i < localStorage.length; i++) {
      // set iteration key name
      var key = localStorage.key(i);
      if (key.charAt(0) == '_') {
        this.searchPortfolio += key.substr(1) + ',';
      }
    }
    this.searchPortfolio = this.searchPortfolio.substring(
      0,
      this.searchPortfolio.length - 1
    );
    console.log(this.searchPortfolio.length);
    if (this.searchPortfolio.length == 0) {
      this.isEmpty = 1;
    }
    this.portfolioService
      .getPortfolioData(this.searchPortfolio)
      .pipe()
      .subscribe((data: any) => {
        data.forEach(function(item) {
          let tmpObj = JSON.parse(localStorage.getItem('_' + item.ticker));
          console.log(tmpObj);
          item['name'] = tmpObj.name;
          item['num'] = tmpObj.num;
          item['totalCost'] = tmpObj.totalCost;
        });
        this.portData = data;
        this.wuhu = JSON.stringify(this.portData);
        hideloader();
      });
  }
  addItem(newItem: number) {
    this.isEmpty = newItem;
  }
}
