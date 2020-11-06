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
    // Load Part //
    function hideloader() {
      document.getElementById('watchLoad').style.display = 'none';
      // console.log('change main display');
      document.getElementById('watchMain').style.display = 'block';
    }

    // Sort arry //
    let sortArray = new Array();
    // Get Search Key word //
    for (var i = 0; i < localStorage.length; i++) {
      // set iteration key name
      var key = localStorage.key(i);
      if (key.charAt(0) != '_') {
        // use key name to retrieve the corresponding value
        sortArray.push(key);
      }
    }
    //
    sortArray.sort();
    console.log(sortArray);
    for (var i = 0; i < sortArray.length; i++) {
      this.searchWord = this.searchWord + sortArray[i] + ',';
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
