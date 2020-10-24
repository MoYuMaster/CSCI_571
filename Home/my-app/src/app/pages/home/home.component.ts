import { HttpClient } from '@angular/common/http';
import {
  Component,
  Injectable,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
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

// let autoSearchResult: Array<object> = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
@Injectable()
export class HomeComponent implements OnInit {
  filteredStock: Stock[] = [];
  isLoading = false;

  constructor(private service: AutoServiceService) {}

  ngOnInit() {
    let options: Array<object> = [];
    // this.getAutoDataFromAPI();
    const searchBox = document.getElementById('search-box');
    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
      filter(text => text.length > 2),
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => (this.isLoading = true)),
      switchMap(searchTerm =>
        ajax(`/api/getAutoData?search=${searchTerm}`).pipe(
          finalize(() => (this.isLoading = false))
        )
      )
    );

    typeahead.subscribe(data => {
      // console.log(data.response[0].ticker);
      // for (var key in data.response) {
      //   if (data.response.hasOwnProperty(key)) {
      //     // here you have access to
      //     options[key] = data.response[key];
      //   }
      // }
      this.filteredStock = data.response;
    });
  }

  // getAutoDataFromAPI() {
  //   this.service.getAutoData().subscribe(
  //     response => {
  //       console.log('Res from api is', response);
  //     },
  //     error => {
  //       console.log('Error is', error);
  //     }
  //   );
  // }

  clickMessage = '';
  onClickMe() {
    console.log('shide');
    // console.log('qifei' + toptions[0].ticker);
  }

  displayFn(stock: Stock) {
    if (stock) {
      return stock.ticker;
    }
  }
}
