import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { TabComponent } from './pages/detail/Tab/tab/tab.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewsComponent } from './pages/detail/Tab/news/news.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { WatchListCardComponent } from './pages/watchlist/watchListCard/watchListCard.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailComponent,
    WatchlistComponent,
    PortfolioComponent,
    TabComponent,
    NewsComponent,
    WatchListCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSliderModule,
    HttpClientModule,
    MaterialModule,
    MatTabsModule,
    FormsModule,
    FontAwesomeModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
