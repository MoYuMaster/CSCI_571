import { Component, OnInit } from '@angular/core';
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
  constructor() {}
  ngOnInit() {
    // $(document).ready(function() {
    //   alert('jQuery Work');
    // });
  }
}
