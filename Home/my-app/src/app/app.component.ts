import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
// import { AppServiceService } from './app-service.service';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-app';
  navStatus = 1;

  constructor() {}
  ngOnInit() {}

  clickSearch() {
    this.navStatus = 1;
  }

  clickWatch() {
    this.navStatus = 2;
  }
  clickPort() {
    this.navStatus = 3;
  }
  clickBtn() {
    this.navStatus = 0;
  }
}
