import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

export interface Profissional {
  id: number;
  nome: string;
  empresa: string;
  email?: string;
  telefone?: string;
  cpfCnpj?: string;
  especialidadePrincipal?: string;
  especialidades?: any[];
  observacoes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  listarProfissionais(): Observable<Profissional[]> {
    return this.http.get<Profissional[]>(`${this.apiUrl}/profissionais`);
  }

  obterPerfilProfissional(id: number): Observable<Profissional> {
    // Usando switchMap para aplanar o Observable aninhado
    return this.listarProfissionais().pipe(
      switchMap(profissionais => {
        const profissionalEncontrado = profissionais.find(p => p.id === id);
        if (!profissionalEncontrado) {
          throw new Error('Profissional não encontrado');
        }
        return this.obterPerfilProfissionalPorNome(profissionalEncontrado.nome);
      }),
      catchError(error => {
        console.error('Erro ao obter perfil por ID:', error);
        return of({} as Profissional);
      })
    );
  }

  obterPerfilProfissionalPorNome(nome: string): Observable<Profissional> {
    return this.http.get<Profissional>(`${this.apiUrl}/profissionais/${nome}`)
      .pipe(
        map(data => {
          // Preencher campos que podem não existir na resposta da API
          return {
            ...data,
            email: data.email || '',
            telefone: data.telefone || '',
            cpfCnpj: data.cpfCnpj || '',
            especialidadePrincipal: data.especialidadePrincipal || '',
            especialidades: data.especialidades || [],
            observacoes: data.observacoes || ''
          };
        }),
        catchError(error => {
          console.error('Erro ao obter perfil por nome:', error);
          return of({} as Profissional);
        })
      );
  }

  atualizarProfissional(id: number, dadosProfissional: Partial<Profissional>): Observable<Profissional> {
    // Usando switchMap para aplanar o Observable aninhado
    return this.listarProfissionais().pipe(
      switchMap(profissionais => {
        const profissionalEncontrado = profissionais.find(p => p.id === id);
        if (!profissionalEncontrado) {
          throw new Error('Profissional não encontrado');
        }
        return this.http.put<Profissional>(`${this.apiUrl}/profissionais/${profissionalEncontrado.nome}`, dadosProfissional);
      }),
      catchError(error => {
        console.error('Erro ao atualizar profissional:', error);
        throw error;
      })
    );
  }
}