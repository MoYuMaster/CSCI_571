import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getDetailData(keyWord) {
    return this.http.get('/getDetailData/?search=' + keyWord);
  }

  getSummaryTabData(keyWord) {
    return this.http.get('/getSummaryTabData/?search=' + keyWord);
  }

  getNewsTabData(keyWord) {
    return this.http.get('/getNewsTabData/?search=' + keyWord);
  }

  getChartTabData(keyWord) {
    return this.http.get('/getChartTabData/?search=' + keyWord);
  }
}
