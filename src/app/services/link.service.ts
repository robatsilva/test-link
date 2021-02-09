import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Link } from '../models/link.model';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

constructor(private http: HttpClient) { }

  getInfo(): Observable<Link[]>{
    return this.http.get<Link[]>('https://my-json-server.typicode.com/galvarenga/testeAngular/dadosFinanceiros');
  }

}
