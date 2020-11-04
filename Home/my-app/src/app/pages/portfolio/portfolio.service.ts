import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getPortfolioData(keyWord) {
    return this.http.get('/api/getPortfolioData/?search=' + keyWord);
  }
}
