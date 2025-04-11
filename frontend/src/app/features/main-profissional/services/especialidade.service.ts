import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {
  private apiUrl = 'https://two025-1a-t13-es05-g04.onrender.com';

  constructor(private http: HttpClient) { }

  listarEspecialidades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/especialidade`);
  }

  obterEspecialidade(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/especialidade/${id}`);
  }

  listarEspecialidadesPorProfissional(profissionalNome: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profissional-especialidade/profissional/${profissionalNome}`);
  }

  cadastrarEspecialidade(nome: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/especialidade`, { nome });
  }
}