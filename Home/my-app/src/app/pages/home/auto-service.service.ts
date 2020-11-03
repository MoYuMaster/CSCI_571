import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {} from 'rxjs/add/operator/map';
import { Stock, StockResponse } from './ticker.class';

@Injectable({
  providedIn: 'root'
})
export class AutoServiceService {
  constructor(private http: HttpClient) {}

  //ajax(`/api/getAutoData?search=${searchTerm}`)
  getAutoData(
    keyWord,
    filter: { name: string } = { name: '' },
    page = 1
  ): Observable<StockResponse> {
    return this.http
      .get<StockResponse>('/api/getAutoData?search=' + keyWord)
      .pipe(
        tap((response: StockResponse) => {
          response.results = response
            .map(stock => new Stock(stock.ticker, stock.name))
            // Not filtering in the server since in-memory-web-api has somewhat restricted api
            .filter(stock => stock.name.includes(filter.name));
          return response;
        })
      );
  }
}
