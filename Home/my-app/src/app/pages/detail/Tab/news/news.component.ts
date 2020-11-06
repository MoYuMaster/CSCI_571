import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  @Input() singleNews: any;
  cardID: string;

  constructor() {}

  ngOnInit(): void {
    this.cardID = this.singleNews.id;
  }
}
