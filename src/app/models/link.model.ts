export class Link {
  ano: number;
  nomeEstado: string;
  dadosEstado: DadosEstado[];
}

export class DadosEstado {
  trimestre: number;
  totalReceita: number;
  totalDespesa: number;
  meta: number;
}
