import { Component, OnInit } from '@angular/core';
import { WatchlistService } from './watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  constructor(private watchService: WatchlistService) {}

  searchWord: string;
  cardData: any;
  tickerArray: any;
  nameArray: any;
  watchEmpty: any;

  ngOnInit(): void {
    this.searchWord = '';
    let tickerArray = new Array();
    let nameArray = new Array();
    // Load Part //
    function hideloader() {
      document.getElementById('watchLoad').style.display = 'none';
      // console.log('change main display');
      document.getElementById('watchMain').style.display = 'block';
    }

    // Get Search Key word //
    for (var i = 0; i < localStorage.length; i++) {
      // set iteration key name
      var key = localStorage.key(i);
      if (key.charAt(0) != '_') {
        // use key name to retrieve the corresponding value
        var value = localStorage.getItem(key);
        tickerArray.push(key);
        nameArray.push(value);
        this.searchWord = this.searchWord + key + ',';
      }
    }
    this.searchWord = this.searchWord.slice(0, -1);
    if (this.searchWord.length == 0) {
      this.watchEmpty = 1;
    }
    this.watchService
      .getWatchListData(this.searchWord)
      .pipe()
      .subscribe((data: any) => {
        this.cardData = data;
        hideloader();
      });
  }
  watchCheck(newItem: number) {
    this.watchEmpty = newItem;
  }
}
