import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SearchService } from './search.service';
import { tick } from '@angular/core/testing';
import { error } from 'protractor';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  detailData: object;
  currentItem: any;
  loading: false;
  keyWord: string;
  currentPrice: any;
  total: any;
  // news Data //
  news: any;
  upperDetail: any;
  // color
  status: any;
  // market
  market: any;
  // Buy part //

  // prompt //
  addedPrompt: any;
  //
  chartColor: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.total = 0;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.keyWord = params.get('stock');
    });
    this.fetchDetailData();
    this.fetchSummaryData();
    this.fetchNewsData();
    // Refresh Set //
    setInterval(() => this.fetchDetailData(), 1000 * 15);
    setInterval(() => this.fetchSummaryData(), 1000 * 4 * 60);
  }

  // Get Detail upper data //
  fetchDetailData() {
    this.searchService
      .getDetailData(this.keyWord)
      .pipe()
      .subscribe(
        (data: any) => {
          this.chartColor = 'black';
          this.currentPrice = data.lastPrice;
          // Assign left side data //
          this.upperDetail = data;
          this.market = data.marketStatus == 1 ? 1 : 0;
          // Display checkbox //
          const ele = document.getElementById(
            'id-of-input'
          ) as HTMLInputElement;
          if (localStorage.getItem(data.ticker) != null) {
            ele.checked = true;
          } else {
            ele.checked = false;
          }
          // Change Detect //
          let char = this.upperDetail.change.charAt(0);
          if (char == '-') {
            this.status = -1;
            this.chartColor = 'red';
          } else {
            let test = this.upperDetail.change.substr(1);
            if (test == '0.00') {
              this.status = 0;
              this.chartColor = 'black';
            } else {
              this.status = 1;
              this.chartColor = 'green';
            }
          }
        },
        (error) => {
          document.getElementById('tickerWrong').style.display = 'block';
        }
      );
  }

  // Get Summary Data //
  fetchSummaryData() {
    this.searchService
      .getSummaryTabData(this.keyWord)
      .pipe()
      .subscribe((data: any) => {
        this.currentItem = data;
        this.hideloader();
      }),
      (error) => {
        console.log(error);
      };
  }
  // Get News Data //
  fetchNewsData() {
    this.searchService
      .getNewsTabData(this.keyWord)
      .pipe()
      .subscribe(
        (data: any) => {
          // console.log(data);
          this.news = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // Hide Loader //
  hideloader() {
    document.getElementById('loading').style.display = 'none';
    // console.log('change main display');
    document.getElementById('main').style.display = 'block';
  }

  // Set Favorite //
  setFavorite() {
    // Fix 'checked' does not exist on type 'HTMLElement' Problem
    const ele = document.getElementById('id-of-input') as HTMLInputElement;
    if (ele.checked == false) {
      localStorage.removeItem(this.upperDetail.ticker);
      document.getElementById('removePrompt').style.display = 'block';
      setTimeout(function () {
        document.getElementById('removePrompt').style.display = 'none';
        console.log('shide');
      }, 3000);
    } else {
      localStorage.setItem(this.upperDetail.ticker, this.upperDetail.name);
      document.getElementById('addedPrompt').style.display = 'block';
      setTimeout(function () {
        document.getElementById('addedPrompt').style.display = 'none';
        console.log('shide');
      }, 3000);
    }
  }

  // Buy button, set local storage, show prompt //
  buy() {
    let searchKey = '_' + this.upperDetail.ticker;
    if (localStorage.getItem(searchKey) == null) {
      let tickerObj = {
        ticker: this.upperDetail.ticker,
        name: this.upperDetail.name,
        num: this.total,
        totalCost: Number((this.total * this.currentPrice).toFixed(2)),
      };
      localStorage.setItem(searchKey, JSON.stringify(tickerObj));
    } else {
      let tmpObj = JSON.parse(localStorage.getItem(searchKey));
      tmpObj.num += this.total;
      tmpObj.totalCost += Number((this.total * this.currentPrice).toFixed(2));
      localStorage.setItem(searchKey, JSON.stringify(tmpObj));
    }
    document.getElementById('buyPrompt').style.display = 'block';
    setTimeout(function () {
      document.getElementById('addedPrompt').style.display = 'none';
      console.log('shide');
    }, 3000);
  }

  // Function for delete prompt before auto disappear //
  deleteAddPrompt() {
    document.getElementById('addPrompt').style.display = 'none';
  }
  deleteRemovePrompt() {
    document.getElementById('removePrompt').style.display = 'none';
  }
  deleteBuyPrompt() {
    document.getElementById('buyPrompt').style.display = 'none';
  }
}
