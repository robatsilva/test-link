import { DataRowOutlet } from "@angular/cdk/table";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import * as Highcharts from "highcharts";
import { BehaviorSubject } from "rxjs";
import { Link, DadosEstado } from "./models/link.model";
import { LinkService } from "./services/link.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    "trimestre",
    "receita",
    "despesa",
    "lucro",
    "status",
  ];
  states = new FormControl(["Todos"]);
  years = new FormControl(["Todos"]);

  link: Link[];

  dadosEstado = new BehaviorSubject<DadosEstado[]>([]);

  yearList: string[] = [];
  statesList: string[] = [];
  highcharts = Highcharts;
  chartOptions = new BehaviorSubject<any>({
    chart: {
      type: "spline",
    },
    title: {
      text: "Evolução dos lucros",
    },
    xAxis: {
      categories: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4"],
    },
    yAxis: {
      title: {
        text: "Lucro",
      },
    },
    series: [],
  });

  highcharts2 = Highcharts;
  chartOptions2 = new BehaviorSubject<any>({
    chart: {
      type: "pie",
    },
    title: {
      text: "Receita X Trimestre",
    },
    xAxis: {
      categories: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4"],
    },
    yAxis: {
      title: {
        text: "Lucro",
      },
    },
    series: [],
  });
  highcharts3 = Highcharts;
  chartOptions3 = new BehaviorSubject<any>({
    chart: {
      type: "pie",
    },
    title: {
      text: "Despesa X Trimestre",
    },
    xAxis: {
      categories: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4"],
    },
    yAxis: {
      title: {
        text: "Lucro",
      },
    },
    series: [],
  });


  highcharts4 = Highcharts;
  chartOptions4 = new BehaviorSubject<any>({
    chart: {
        type: 'column'
    },
    title: {
        text: 'Resultado'
    },
    xAxis: {
        categories: [],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Resultado'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: []
});

  constructor(
    private linkService: LinkService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.linkService.getInfo().subscribe((link: Link[]) => {
      this.link = link;
      this.setLists(link);
    });

    this.listeners();
  }

  public onFilter() {
    if (
          this.states.value.length === 1 &&
          this.states.value[0] === "Todos" &&
          this.years.value.length === 1 &&
          this.years.value[0] === "Todos") {
      this.snackBar.open("Selecione pelo menos um estado ou um ano", "", {
        duration: 2000,
      });
      return;
    }

    if(
      this.states.value.length === 0 ||
      this.years.value.length === 0
    ){
      this.snackBar.open("Estado e ano são obrigatórios", "", {
        duration: 2000,
      });
      return;
    }
    this.dadosEstado.next([]);
    const chartOptionsaux = this.chartOptions.value;
    chartOptionsaux.series = [];
    this.chartOptions.next(undefined);
    const chartOptionsaux2 = this.chartOptions2.value;
    chartOptionsaux2.series = [];
    this.chartOptions2.next(undefined);
    const chartOptionsaux3 = this.chartOptions3.value;
    chartOptionsaux3.series = [];
    this.chartOptions3.next(undefined);
    const chartOptionsaux4 = this.chartOptions4.value;
    chartOptionsaux4.series = [];
    chartOptionsaux4.xAxis.categories = [];
    this.chartOptions4.next(undefined);
    let filtered = this.link.filter((linkData) =>
      this.states.value.some(
        (state) => state === linkData.nomeEstado || state === "Todos"
      )
    );

    filtered = filtered.filter((linkData) =>
      this.years.value.some(
        (year) => year === linkData.ano.toString() || year === "Todos"
      )
    );

    filtered.forEach((linkData) => {
      linkData.dadosEstado.forEach((dadoTrimestre) => {
        let serie = chartOptionsaux.series.find(
          (serie) => serie.name === linkData.nomeEstado
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
          serie.data.push(
            dadoTrimestre.totalReceita - dadoTrimestre.totalDespesa
          );
        }


        let serie4 = chartOptionsaux4.series.find(
          (serie) => serie.name === `Ano ${linkData.ano} Trimestre ${dadoTrimestre.trimestre}`
        );
        if (!serie4) {
          serie4 = {
            name: `Ano ${linkData.ano} Trimestre ${dadoTrimestre.trimestre}`,
            data: [dadoTrimestre.meta],
          };
          chartOptionsaux4.series.push(serie4);
          chartOptionsaux4.xAxis.categories.push(`Ano ${linkData.ano} Trimestre ${dadoTrimestre.trimestre}`);
        } else {
          serie4.data[0] = ((serie4.data[0] + dadoTrimestre.meta) / 2);
        }


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

      });

    });
    chartOptionsaux2.series.push({
      name: 'Receita',
      data: this.dadosEstado.value.map(dado => {
        return {
            name: 'Trimestre ' + dado.trimestre,
            y: dado.totalReceita
        }
      })
    });

    chartOptionsaux3.series.push({
      name: 'Despesa',
      data: this.dadosEstado.value.map(dado => {
        return {
            name: 'Trimestre ' + dado.trimestre,
            y: dado.totalDespesa
        }
      })
    });

    setTimeout(() => {
      this.chartOptions.next({ ...chartOptionsaux });
      this.chartOptions2.next({...chartOptionsaux2});
      this.chartOptions3.next({...chartOptionsaux3});
      this.chartOptions4.next({...chartOptionsaux4});
    }, 0);
  }

  public listeners() {
    this.states.valueChanges.subscribe(() => {
      if (this.states.value.length > 1 && this.states.value.some(val => val === 'Todos')) {
        this.states.setValue(this.states.value.filter(val => val !== 'Todos'))
      }
      if (this.states.value.length === 1 && this.states.value[0] === "Todos") {
        this.yearList = this.link
          .map((linkData) => linkData.ano.toString())
          .filter(onlyUnique)
          .sort((a, b) => (a >= b ? 1 : -1));
      } else {
        this.yearList = this.link
          .filter((linkData) =>
            this.states.value.some((state) => state === linkData.nomeEstado)
          )
          .map((linkData) => linkData.ano.toString())
          .filter(onlyUnique)
          .sort((a, b) => (a >= b ? 1 : -1));
      }
      this.yearList.unshift("Todos");
    });
    this.years.valueChanges.subscribe(() => {
      if (this.years.value.length > 1 && this.years.value.some(val => val === 'Todos')) {
        this.years.setValue(this.years.value.filter(val => val !== 'Todos'))
      }
    });
  }

  private setLists(link: Link[]) {
    this.yearList = link
      .map((linkData) => linkData.ano.toString())
      .filter(onlyUnique)
      .sort((a, b) => (a >= b ? 1 : -1));
    this.statesList = link
      .map((linkData) => linkData.nomeEstado)
      .filter(onlyUnique)
      .sort((a, b) => (a >= b ? 1 : -1));

    this.yearList.unshift("Todos");
    this.statesList.unshift("Todos");
  }
  private buildChart2(){

  }
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
