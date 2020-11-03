import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getDetailData(keyWord) {
    return this.http.get('/api/getDetailData/?search=' + keyWord);
  }

  getSummaryTabData(keyWord) {
    return this.http.get('/api/getSummaryTabData/?search=' + keyWord);
  }

  getNewsTabData(keyWord) {
    return this.http.get('/api/getNewsTabData/?search=' + keyWord);
  }
}
