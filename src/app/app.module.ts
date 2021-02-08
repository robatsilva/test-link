import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HighchartsChartComponent } from 'highcharts-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
   declarations: [
      AppComponent,
      HighchartsChartComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
