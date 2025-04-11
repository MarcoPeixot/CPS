import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  listarProfissionais(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profissionais`);
  }

}
