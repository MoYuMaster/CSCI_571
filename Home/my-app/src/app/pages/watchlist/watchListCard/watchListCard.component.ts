import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-watchListCard',
  templateUrl: './watchListCard.component.html',
  styleUrls: ['./watchListCard.component.css']
})
export class WatchListCardComponent implements OnInit {
  @Input() singleData: any;
  tickerName: any;
  status: any;

  constructor() {}
  ngOnInit(): void {
    this.tickerName = localStorage.getItem(this.singleData.ticker);
    // Color Change Check //
    let char = this.singleData.change.charAt(0);
    if (char == '-') {
      this.status = -1;
    } else {
      let test = this.singleData.change.substr(1);
      if (test == '0.00') {
        this.status = 0;
      } else {
        this.status = 1;
      }
    }
  }

  deleteCard() {
    console.log('wuhu');
    localStorage.removeItem(this.singleData.ticker);
    document.getElementById(this.singleData.ticker + 'watch').innerHTML = '';
  }
}
