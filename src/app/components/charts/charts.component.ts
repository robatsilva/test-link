import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnInit {
  @Input() chartOptions;
  @Input() chartOptions2;
  @Input() chartOptions3;
  @Input() chartOptions4;

  highcharts = Highcharts;
  highcharts2 = Highcharts;
  highcharts3 = Highcharts;
  highcharts4 = Highcharts;
  constructor() { }

  ngOnInit() {
  }

}
