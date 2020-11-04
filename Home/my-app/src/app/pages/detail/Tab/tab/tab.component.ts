import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../../search.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @Input() item: any;
  @Input() news: any;
  // singleNews: any;
  chartOptions: {};
  Highcharts = Highcharts;

  constructor() {}

  ngOnInit() {
    console.log(this.item);
    this.chartOptions = {
      title: {
        text: this.item.ticker
      },
      series: [
        {
          data: this.item.chartData,
          type: 'line'
        }
      ]
    };
  }
}
