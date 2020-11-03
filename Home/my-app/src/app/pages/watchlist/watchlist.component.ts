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

  ngOnInit(): void {
    // var retrievedObject = localStorage.getItem('testObject');
    // console.log('retrievedObject: ', JSON.parse(retrievedObject));
    this.searchWord = '';
    let tickerArray = new Array();
    let nameArray = new Array();
    // Get Search Key word //
    for (var i = 0; i < localStorage.length; i++) {
      // set iteration key name
      var key = localStorage.key(i);

      // use key name to retrieve the corresponding value
      var value = localStorage.getItem(key);
      tickerArray.push(key);
      nameArray.push(value);

      this.searchWord = this.searchWord + key + ',';
      // console.log the iteration key and value
      console.log('Key: ' + key + ', Value: ' + value);
    }
    this.searchWord = this.searchWord.slice(0, -1);
    // this.tickerArray = tickerArray;
    // this.nameArray = nameArray;
    // console.log(this.searchWord);
    // console.log(tickerArray.length);
    this.watchService
      .getWatchListData(this.searchWord)
      .pipe()
      .subscribe((data: any) => {
        this.cardData = data;
        console.log(this.cardData);
      });
  }
}
