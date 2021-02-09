import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import * as Highcharts from 'highcharts';
import { Link, DadosEstado } from './models/link.model';
import { LinkService } from './services/link.service';
@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  displayedColumns: string[] = ['trimestre', 'receita', 'despesa', 'lucro', 'status'];
  states = new FormControl(['Todos']);
  years = new FormControl(['Todos']);

  link: Link[];

  dadosEstado: DadosEstado[] = [];

  yearList: string[] = [];
  statesList: string[] = [];
   highcharts = Highcharts;
   chartOptions = {
      chart: {
         type: 'spline'
      },
      title: {
         text: 'Monthly Average Temperature'
      },
      subtitle: {
         text: 'Source: WorldClimate.com'
      },
      xAxis: {
         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
         title: {
            text: 'Temperature °C'
         }
      },
      tooltip: {
         valueSuffix: ' °C'
      },
      series: [
         {
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
         },
         {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
         },
         {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
         },
         {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
         }
      ]
   };

   constructor(private linkService: LinkService,
    private snackBar: MatSnackBar){}

   ngOnInit(){
    this.linkService.getInfo()
      .subscribe((link: Link[])=>{
        this.link = link;
        this.setLists(link);
      })
   }

   public onFilter(){
     if(this.states.value.length === 1 && this.states.value[0] === 'Todos' &&
        this.years.value.length === 1 && this.years.value[0] === 'Todos'){
       this.snackBar.open('Selecione pelo menos um estado ou um ano', '', {
        duration: 2000,
      });
     }

     this.link.forEach(l => {
      l.dadosEstado.map(d => d)
        .reduce((a, b, i, dados) => {
          let dado = a;
          if(a.trimestre === b.trimestre){
            dado.totalDespesa = a.totalDespesa + b.totalDespesa;
            dado.totalReceita = a.totalReceita + b.totalReceita;
            dado.meta = (a.meta + b.meta) / 2;
            this.dadosEstado = [...this.dadosEstado, ...[dado]];
          }
          return dado;
        })
     });
   }

   private setLists(link: Link[]){
      this.yearList = link.map(linkData => linkData.ano.toString())
        .filter(onlyUnique)
        .sort((a, b) => a >= b ? 1 : -1);
      this.statesList = link.map(linkData => linkData.nomeEstado)
        .filter(onlyUnique)
        .sort((a, b) => a >= b ? 1 : -1);

      this.yearList.unshift('Todos');
      this.statesList.unshift('Todos');
   }
}

export function onlyUnique(value, index, self){
  return self.indexOf(value) === index;
}
