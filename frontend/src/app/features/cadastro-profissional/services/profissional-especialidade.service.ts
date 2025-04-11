import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalEspecialidadeService {
  private apiUrl = 'http://localhost:3000/profissionais-especialidades'; // URL do backend

  constructor(private http: HttpClient) { }

  // Criar uma associação entre profissional e especialidade
  associarProfissionalEspecialidade(profissionalNome: string, especialidadeNome: string): Observable<any> {
    return this.http.post(this.apiUrl, { profissionalNome, especialidadeNome });
  }

  // Listar associações por nome do profissional
  listarPorProfissionalNome(profissionalNome: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profissional/${profissionalNome}`);
  }

  // Listar associações por nome da especialidade
  listarPorEspecialidadeNome(especialidadeNome: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/especialidade/${especialidadeNome}`);
  }

  // Remover uma associação
  deletarAssociacao(profissionalNome: string, especialidadeNome: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}`, {
      body: { profissionalNome, especialidadeNome } // Envia no corpo da requisição
    });
  }
}