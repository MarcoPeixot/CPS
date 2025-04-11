// services/aluno-profissional.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoProfissionalService {
  private apiUrl = 'http://localhost:3000'; // URL da sua API

  constructor(private http: HttpClient) {}

  associarAlunoProfissional(alunoId: number, profissionalId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/aluno-profissional`, {
      aluno_id: alunoId,
      profissional_id: profissionalId
    });
  }

  listarProfissionaisPorAluno(alunoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/aluno-profissional/aluno/${alunoId}`);
  }

  listarAlunosPorProfissional(profissionalId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/aluno-profissional/profissional/${profissionalId}`);
  }

  removerAssociacao(alunoId: number, profissionalId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/aluno-profissional/${alunoId}/${profissionalId}`);
  }
}