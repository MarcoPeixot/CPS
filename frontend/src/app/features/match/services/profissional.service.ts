import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Profissional {
  id: number;
  nome: string;
  formacao?: string;
  especialidade?: string;
}

export interface Aluno {
  id: number;
  nome: string;
  curso?: string;
  deficiencia?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private apiUrl = 'https://two025-1a-t13-es05-g04.onrender.com';

  constructor(private http: HttpClient) { }

  listarProfissionais(): Observable<Profissional[]> {
    return this.http.get<Profissional[]>(`${this.apiUrl}/profissionais`).pipe(
      catchError(this.handleError<Profissional[]>('listarProfissionais', []))
    );
  } 

  getAluno(alunoId: string | number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/alunos/${alunoId}`).pipe(
      catchError(this.handleErrorWithMock<Aluno>('getAluno', {
        id: typeof alunoId === 'string' ? parseInt(alunoId) : alunoId,
        nome: 'João Silva',
        curso: 'Engenharia de Computação',
        deficiencia: 'Deficiência Auditiva',
      }))
    );
  }

  getProfissional(profissionalId: string | number): Observable<Profissional> {
    return this.http.get<Profissional>(`${this.apiUrl}/profissionais/${profissionalId}`).pipe(
      catchError(this.handleErrorWithMock<Profissional>('getProfissional', {
        id: typeof profissionalId === 'string' ? parseInt(profissionalId) : profissionalId,
        nome: 'Maria Souza',
        formacao: 'Psicologia',
        especialidade: 'Educação Especial',
      }))
    );
  }

  // Método genérico de tratamento de erro com mock
  private handleErrorWithMock<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.warn(`${operation} falhou: ${error.message}`);
      console.warn('Retornando dados mockados');
      return of(result as T);
    };
  }

  // Método genérico de tratamento de erro
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falhou: ${error.message}`);
      return of(result as T);
    };
  }
}