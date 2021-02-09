import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HighchartsChartComponent } from 'highcharts-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButton, MatButtonModule, MatSnackBarModule, MatTableModule } from '@angular/material';
@NgModule({
   declarations: [
      AppComponent,
      HighchartsChartComponent
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
