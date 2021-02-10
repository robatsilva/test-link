import { DadosEstado } from './../../models/link.model';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  @Input()   dadosEstado: DadosEstado[];
  displayedColumns: string[] = [
    'trimestre',
    'receita',
    'despesa',
    'lucro',
    'status',
  ];
  constructor() { }

  ngOnInit() {
  }

}
