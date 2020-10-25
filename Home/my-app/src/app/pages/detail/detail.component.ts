import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ajax } from 'rxjs/ajax';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { strict } from 'assert';
import { stringify } from 'querystring';
import { map } from 'jquery';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearchService } from './search.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  loading: false;
  keyWord: string;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.http
      .get('http://www.mocky.io/v2/5ec6a61b3200005e00d75058')
      .subscribe(Response => {
        if (Response) {
          hideloader();
        }
        console.log('in');
      });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.keyWord = params.get('stock');
      console.log(this.keyWord);
    });

    function hideloader() {
      document.getElementById('loading').style.display = 'none';
      console.log('change main display');
      document.getElementById('main').style.display = 'block';
    }
  }

  onClick() {
    console.log(this.keyWord);
    this.searchService
      .getDetailData(this.keyWord)
      .pipe()
      .subscribe(data => {
        console.log('Have', data);
      });
  }
}
