import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../../search.service';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
import Indicators from 'highcharts/indicators/indicators';
import VolumeByPrice from 'highcharts/indicators/volume-by-price';
Indicators(Highcharts);
VolumeByPrice(Highcharts);

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements OnInit {
  @Input() item: any;
  @Input() news: any;
  @Input() chartColor: any;
  // singleNews: any;
  // Detail Chart
  chartOptions: Highcharts.Options;
  Highcharts: typeof Highcharts = Highcharts;
  // Tab Chart
  chartOptions2: Highcharts.Options;
  Highcharts2: typeof Highcharts = Highcharts;
  // add comma//
  volumnComma: any;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.volumnComma = this.toThousands(this.item.volume);

    this.chartOptions = {
      chart: { reflow: true },
      rangeSelector: {
        enabled: false,
      },
      title: {
        text: this.item.ticker,
      },
      series: [
        {
          name: this.item.ticker,
          tooltip: { valueDecimals: 2 },
          type: 'line',
          data: this.item.chartData,
          color: this.chartColor,
        },
      ],
      navigator: { series: { color: this.chartColor } },
    };
    this.searchService
      .getChartTabData(this.item.ticker)
      .pipe()
      .subscribe((chartData: any) => {
        this.chartOptions2 = {
          rangeSelector: {
            selected: 2,
          },

          title: {
            text: this.item.ticker + ' Historical',
          },

          subtitle: {
            text: 'With SMA and Volume by Price technical indicators',
          },

          yAxis: [
            {
              startOnTick: false,
              endOnTick: false,
              labels: {
                align: 'right',
                x: -3,
              },
              title: {
                text: 'OHLC',
              },
              height: '60%',
              lineWidth: 2,
              resize: {
                enabled: true,
              },
            },
            {
              labels: {
                align: 'right',
                x: -3,
              },
              title: {
                text: 'Volume',
              },
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2,
            },
          ],

          tooltip: {
            split: true,
          },

          plotOptions: {
            series: {
              dataGrouping: {
                units: [
                  ['week', [1]],
                  ['month', [1, 2, 3, 4, 6]],
                ],
              },
            },
          },

          series: [
            {
              type: 'candlestick',
              name: this.item.ticker,
              id: this.item.ticker,
              zIndex: 2,
              data: chartData.ohlc,
            },
            {
              type: 'column',
              name: 'Volume',
              id: 'volume',
              data: chartData.volume,
              yAxis: 1,
            },
            {
              type: 'vbp',
              linkedTo: this.item.ticker,
              params: {
                volumeSeriesID: 'volume',
              },
              dataLabels: {
                enabled: false,
              },
              zoneLines: {
                enabled: false,
              },
            },
            {
              type: 'sma',
              linkedTo: this.item.ticker,
              zIndex: 1,
              marker: {
                enabled: false,
              },
            },
          ],
        };
      });
  }

  toThousands(num) {
    var num = (num || 0).toString(),
      result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  }
}
