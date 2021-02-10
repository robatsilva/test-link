import { ChartsComponent } from './components/charts/charts.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HighchartsChartComponent } from 'highcharts-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButton, MatButtonModule, MatSnackBarModule, MatTableModule } from '@angular/material';
import { TableComponent } from './components/table/table.component';
import { FilterComponent } from './components/filter/filter.component';
@NgModule({
   declarations: [
      AppComponent,
      HighchartsChartComponent,
      TableComponent,
      FilterComponent,
      ChartsComponent
   ],
   imports: [
      FormsModule,
      ReactiveFormsModule,
      BrowserModule,
      BrowserAnimationsModule,
      MatSelectModule,
      MatButtonModule,
      MatTableModule,
      MatSnackBarModule,
      HttpClientModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
