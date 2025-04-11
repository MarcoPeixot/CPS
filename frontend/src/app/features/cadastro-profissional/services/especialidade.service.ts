import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {
  private apiUrl = 'http://localhost:3000/especialidade'; // URL do backend para especialidades

  constructor(private http: HttpClient) { }

  // Listar todas as especialidades
  listarEspecialidades(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Buscar uma especialidade pelo nome
  buscarEspecialidade(nome: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nome}`);
  }

  // Criar uma nova especialidade
  criarEspecialidade(especialidade: { nome: string }): Observable<any> {
    return this.http.post(this.apiUrl, especialidade);
  }

  // Deletar uma especialidade pelo nome
  deletarEspecialidade(nome: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${nome}`);
  }
}