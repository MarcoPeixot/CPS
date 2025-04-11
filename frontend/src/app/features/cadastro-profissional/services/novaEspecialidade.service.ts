import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NovaEspecialidadeService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  listarNovasEspecialidades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nova-especialidade`);
  }

  buscarNovaEspecialidade(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/nova-especialidade/${id}`);
  }

  criarNovaEspecialidade(especialidade: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/nova-especialidade`, especialidade);
  }

  atualizarNovaEspecialidade(id: number, especialidade: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/nova-especialidade/${id}`, especialidade);
  }

  deletarNovaEspecialidade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/nova-especialidade/${id}`);
  }
}