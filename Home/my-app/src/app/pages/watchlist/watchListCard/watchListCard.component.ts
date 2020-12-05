import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-watchListCard',
  templateUrl: './watchListCard.component.html',
  styleUrls: ['./watchListCard.component.css']
})
export class WatchListCardComponent implements OnInit {
  @Input() singleData: any;
  @Output() watchCheck = new EventEmitter<number>();
  tickerName: any;
  status: any;
  watchlistCheck: any;

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
    localStorage.removeItem(this.singleData.ticker);
    document.getElementById(this.singleData.ticker + 'watch').innerHTML = '';
    this.watchlistCheck = 0;
    for (var i = 0; i < localStorage.length; i++) {
      // set iteration key name
      var key = localStorage.key(i);
      if (key.charAt(0) != '_') {
        // use key name to retrieve the corresponding value
        this.watchlistCheck++;
      }
    }
    if (this.watchlistCheck == 0) {
      this.watchCheck.emit(1);
    }
  }
}
