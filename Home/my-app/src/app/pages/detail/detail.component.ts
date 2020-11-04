import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SearchService } from './search.service';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
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

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.total = 0;
    this.http
      .get('http://www.mocky.io/v2/5ec6a61b3200005e00d75058')
      .subscribe(Response => {
        if (Response) {
          hideloader();
        }
      });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.keyWord = params.get('stock');
      // console.log(this.keyWord);
    });

    function hideloader() {
      document.getElementById('loading').style.display = 'none';
      // console.log('change main display');
      document.getElementById('main').style.display = 'block';
    }

    // Get Detail upper data //
    this.searchService
      .getDetailData(this.keyWord)
      .pipe()
      .subscribe((data: any) => {
        this.currentPrice = data.lastPrice;
        // Assign left side data //
        this.upperDetail = data;
        // let marketSt = 'Market ';
        // marketSt +=
        //   data.marketStatus == 1 ? 'is Open' : 'Closed on ' + data.lastTime;
        // document.getElementById('market').innerHTML = marketSt;
        this.market = data.marketStatus == 1 ? 1 : 0;
        // Display checkbox //
        const ele = document.getElementById('id-of-input') as HTMLInputElement;
        if (localStorage.getItem(data.ticker) != null) {
          ele.checked = true;
        } else {
          ele.checked = false;
        }
        // Change Detect //
        let char = this.upperDetail.change.charAt(0);
        if (char == '-') {
          this.status = -1;
        } else {
          let test = this.upperDetail.change.substr(1);
          if (test == '0.00') {
            this.status = 0;
          } else {
            this.status = 1;
          }
        }
      });

    // Get Summary Data //
    this.searchService
      .getSummaryTabData(this.keyWord)
      .pipe()
      .subscribe((data: any) => {
        this.currentItem = data;
      });

    // Get News Data //
    this.searchService
      .getNewsTabData(this.keyWord)
      .pipe()
      .subscribe((data: any) => {
        // console.log(data);
        this.news = data;
      });
  }

  setFavorite() {
    // Fix 'checked' does not exist on type 'HTMLElement' Problem
    const ele = document.getElementById('id-of-input') as HTMLInputElement;
    if (ele.checked == false) {
      localStorage.removeItem(this.upperDetail.ticker);
    } else {
      localStorage.setItem(this.upperDetail.ticker, this.upperDetail.name);
    }
  }

  buy() {
    let searchKey = '_' + this.upperDetail.ticker;
    if (localStorage.getItem(searchKey) == null) {
      let tickerObj = {
        ticker: this.upperDetail.ticker,
        name: this.upperDetail.name,
        num: this.total,
        totalCost: this.total * this.currentPrice
      };
      localStorage.setItem(searchKey, JSON.stringify(tickerObj));
    } else {
      let tmpObj = JSON.parse(localStorage.getItem(searchKey));
      tmpObj.num += this.total;
      tmpObj.totalCost += this.total * this.currentPrice;
      localStorage.setItem(searchKey, JSON.stringify(tmpObj));
    }
  }
}
