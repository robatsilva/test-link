import { DataRowOutlet } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import * as Highcharts from 'highcharts';
import { BehaviorSubject, of } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { Link, DadosEstado } from './models/link.model';
import { LinkService } from './services/link.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  states = new FormControl(['Todos']);
  years = new FormControl(['Todos']);

  link: Link[];

  dadosEstado = new BehaviorSubject<DadosEstado[]>([]);

  yearList = new BehaviorSubject<string[]>([]);
  statesList = new BehaviorSubject<string[]>([]);

  chartOptions = new BehaviorSubject<any>({
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Evolução dos lucros',
    },
    xAxis: {
      categories: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'],
    },
    yAxis: {
      title: {
        text: 'Lucro',
      },
    },
    series: [],
  });

  chartOptions2 = new BehaviorSubject<any>({
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Receita X Trimestre',
    },
    xAxis: {
      categories: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'],
    },
    yAxis: {
      title: {
        text: 'Lucro',
      },
    },
    series: [],
  });

  chartOptions3 = new BehaviorSubject<any>({
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Despesa X Trimestre',
    },
    xAxis: {
      categories: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'],
    },
    yAxis: {
      title: {
        text: 'Lucro',
      },
    },
    series: [],
  });

  chartOptions4 = new BehaviorSubject<any>({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Resultado',
    },
    xAxis: {
      categories: [],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Resultado',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [],
  });

  constructor(
    private linkService: LinkService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.linkService
      .getInfo()
      .pipe(
        take(1),
        catchError(() => {
          this.snackBar.open('Erro ao obter os dados', '', {
            duration: 2000,
          });
          return of([]);
        })
      )
      .subscribe((link: Link[]) => {
        this.link = link;
        this.setLists(link);
      });

    this.listeners();
  }

  public onFilter() {
    if (!this.validateFilter()) {
      return;
    }
    this.dadosEstado.next([]);

    const chart1 = this.resetChart(this.chartOptions);

    if (this.years.value.some((val) => val === 'Todos')) {
      this.chartOptions2.value.xAxis.categories = [];
      this.chartOptions3.value.xAxis.categories = [];
    }
    const chart2 = this.resetChart(this.chartOptions2);
    const chart3 = this.resetChart(this.chartOptions3);

    this.chartOptions4.value.xAxis.categories = [];
    const chart4 = this.resetChart(this.chartOptions4);

    const filtered = this.link
      .filter((linkData) =>
        this.states.value.some(
          (state) => state === linkData.nomeEstado || state === 'Todos'
        )
      )
      .filter((linkData) =>
        this.years.value.some(
          (year) => year === linkData.ano.toString() || year === 'Todos'
        )
      );

    filtered.forEach((linkData) => {
      linkData.dadosEstado.forEach((dadoTrimestre) => {
        this.buildTable(dadoTrimestre);
        this.buildChart1(chart1, linkData, dadoTrimestre);
        this.buildChart4(chart4, linkData, dadoTrimestre);
        if (this.years.value.some((val) => val === 'Todos')) {
          this.buildChartPieYear(
            chart2,
            linkData,
            dadoTrimestre,
            'totalReceita',
            'Receita'
          );
          this.buildChartPieYear(
            chart3,
            linkData,
            dadoTrimestre,
            'totalDespesa',
            'Despesa'
          );
        }
      });
    });
    if (!this.years.value.some((val) => val === 'Todos')) {
      this.buildChartPie(chart2, 'Receita', 'totalReceita');
      this.buildChartPie(chart3, 'Despesa', 'totalDespesa');
    }
    setTimeout(() => {
      this.chartOptions.next({ ...chart1 });
      this.chartOptions2.next({ ...chart2 });
      this.chartOptions3.next({ ...chart3 });
      this.chartOptions4.next({ ...chart4 });
    }, 0);
  }

  private validateFilter(): boolean {
    if (
      this.states.value.length === 1 &&
      this.states.value[0] === 'Todos' &&
      this.years.value.length === 1 &&
      this.years.value[0] === 'Todos'
    ) {
      this.snackBar.open('Selecione pelo menos um estado ou um ano', '', {
        duration: 2000,
      });
      return false;
    }

    if (this.states.value.length === 0 || this.years.value.length === 0) {
      this.snackBar.open('Estado e ano são obrigatórios', '', {
        duration: 2000,
      });
      return false;
    }
    return true;
  }

  private listeners() {
    this.states.valueChanges.subscribe(() => {
      if (
        this.states.value.length > 1 &&
        this.states.value.some((val) => val === 'Todos')
      ) {
        this.states.setValue(
          this.states.value.filter((val) => val !== 'Todos')
        );
      }
      if (this.states.value.length === 1 && this.states.value[0] === 'Todos') {
        this.yearList.next(this.getYarsUnique(this.link));
      } else {
        this.yearList.next(
          this.getYarsUnique(
            this.link.filter((linkData) =>
              this.states.value.some((state) => state === linkData.nomeEstado)
            )
          )
        );
      }
      this.yearList.value.unshift('Todos');
    });
    this.years.valueChanges.subscribe(() => {
      if (
        this.years.value.length > 1 &&
        this.years.value.some((val) => val === 'Todos')
      ) {
        this.years.setValue(this.years.value.filter((val) => val !== 'Todos'));
      }
    });
  }

  private setLists(links: Link[]) {
    this.yearList.next(this.getYarsUnique(links));
    this.statesList.next(this.getStatesUnique(links));

    this.yearList.value.unshift('Todos');
    this.statesList.value.unshift('Todos');
  }

  private getStatesUnique(links: Link[]): string[] {
    return links
      .map((linkData) => linkData.nomeEstado.toString())
      .filter(onlyUnique)
      .sort((a, b) => (a >= b ? 1 : -1));
  }
  private getYarsUnique(links: Link[]): string[] {
    return links
      .map((linkData) => linkData.ano.toString())
      .filter(onlyUnique)
      .sort((a, b) => (a >= b ? 1 : -1));
  }

  private buildTable(dadoTrimestre: DadosEstado) {
    const trimestre = this.dadosEstado.value.find(
      (dado) => dado.trimestre === dadoTrimestre.trimestre
    );
    if (trimestre) {
      trimestre.totalDespesa += dadoTrimestre.totalDespesa;
      trimestre.totalReceita += dadoTrimestre.totalReceita;
      trimestre.meta = (trimestre.meta + dadoTrimestre.meta) / 2;
    } else {
      this.dadosEstado.next([
        ...this.dadosEstado.value,
        ...[{ ...dadoTrimestre }],
      ]);
    }
  }

  private buildChart1(
    chartOptionsaux,
    linkData: Link,
    dadoTrimestre: DadosEstado
  ) {
    let serie = chartOptionsaux.series.find(
      (s) => s.name === linkData.nomeEstado
    );
    if (!serie) {
      serie = {
        name: linkData.nomeEstado,
        data: [],
      };
    }
    if (serie.data[dadoTrimestre.trimestre - 1]) {
      serie.data[dadoTrimestre.trimestre - 1] +=
        dadoTrimestre.totalReceita - dadoTrimestre.totalDespesa;
    } else {
      serie.data.push(dadoTrimestre.totalReceita - dadoTrimestre.totalDespesa);
    }
  }

  private buildChart4(
    chartOptionsaux,
    linkData: Link,
    dadoTrimestre: DadosEstado
  ) {
    let serie4 = chartOptionsaux.series.find(
      (serie) =>
        serie.name ===
        `Ano ${linkData.ano} Trimestre ${dadoTrimestre.trimestre}`
    );
    if (!serie4) {
      serie4 = {
        name: `Ano ${linkData.ano} Trimestre ${dadoTrimestre.trimestre}`,
        data: [dadoTrimestre.meta],
      };
      chartOptionsaux.series.push(serie4);
      chartOptionsaux.xAxis.categories.push(
        `Ano ${linkData.ano} Trimestre ${dadoTrimestre.trimestre}`
      );
    } else {
      serie4.data[0] = (serie4.data[0] + dadoTrimestre.meta) / 2;
    }
  }

  private buildChartPieYear(
    chartOptionsaux,
    linkData: Link,
    dadoTrimestre: DadosEstado,
    field: string,
    fieldName: string
  ) {
    let serieYear = chartOptionsaux.series.find(
      (serie) => serie.name === fieldName
    );

    if (!serieYear) {
      serieYear = {
        name: fieldName,
        data: [],
      };
      chartOptionsaux.series.push(serieYear);
      chartOptionsaux.xAxis.categories.push(
        `Ano ${linkData.ano} Trimestre ${dadoTrimestre.trimestre}`
      );
    }
    if (serieYear.data[dadoTrimestre.trimestre - 1]) {
      serieYear.data[dadoTrimestre.trimestre - 1].y += dadoTrimestre[field];
    } else {
      serieYear.data.push({
        name: 'Trimestre ' + dadoTrimestre.trimestre,
        y: dadoTrimestre[field],
      });
    }
  }

  private buildChartPie(chartOptionsaux, name: string, field: string) {
    if (this.states.value.some((state) => state === 'Todos')) {
      return;
    }
    chartOptionsaux.series.push({
      name: name,
      data: this.dadosEstado.value.map((dado) => {
        return {
          name: 'Trimestre ' + dado.trimestre,
          y: dado[field],
        };
      }),
    });
  }

  private resetChart(chart: BehaviorSubject<any>) {
    const chartOptionsaux = chart.value;
    chartOptionsaux.series = [];
    chart.next(undefined);
    return chartOptionsaux;
  }
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
