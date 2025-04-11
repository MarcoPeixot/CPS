import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private apiUrl = 'http://localhost:3000/profissionais'; // URL do backend para profissionais

  constructor(private http: HttpClient) { }

  // Listar todos os profissionais
  listarProfissionais(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Buscar um profissional pelo nome
  buscarProfissional(nome: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${nome}`);
  }

  // Criar um novo profissional
  criarProfissional(profissional: { nome: string, empresa: string }): Observable<any> {
    return this.http.post(this.apiUrl, profissional);
  }

  // Atualizar um profissional pelo nome
  atualizarProfissional(nome: string, profissional: { nome: string, empresa: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${nome}`, profissional);
  }

  // Deletar um profissional pelo nome
  deletarProfissional(nome: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${nome}`);
  }
}