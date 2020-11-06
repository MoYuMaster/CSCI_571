import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { url } from 'inspector';
// for Type-ahead suggestions
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  finalize
} from 'rxjs/operators';
import { AutoServiceService } from './auto-service.service';
import { Stock } from './ticker.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
@Injectable()
export class HomeComponent implements OnInit {
  filteredStock: Stock[] = [];
  isLoading = false;
  ticker = 66;

  constructor(private service: AutoServiceService) {}

  ngOnInit() {
    const searchBox = document.getElementById('search-box');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
      filter(text => text.length > 2),
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => (this.isLoading = true)),
      switchMap(searchTerm =>
        this.service
          .getAutoData(searchTerm)
          .pipe(finalize(() => (this.isLoading = false)))
      )
    );

    typeahead.subscribe(data => {
      this.filteredStock = data.results;
    });
  }

  displayFn(stock: Stock) {
    if (stock) {
      return stock.ticker;
    }
  }

  navigate() {
    console.log('work');
  }
}
