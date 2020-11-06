import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  constructor(private http: HttpClient) {}

  getWatchListData(keyWord) {
    return this.http.get('/getWatchListData/?search=' + keyWord);
  }
}
