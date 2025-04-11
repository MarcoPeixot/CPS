import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SchoolApiService } from '../../../core/services/school-api.service';
import { Student } from '../../../models/student.model'; // Supondo que você tenha um modelo Student definido

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private apiUrl = 'http://localhost:3000/alunos';

  constructor(private http: HttpClient, private schoolApiService: SchoolApiService) {}

  listarAlunosPorInstituicao(instituicaoId: number): Observable<any[]> {
    return this.schoolApiService.getStudentsByInstitution(instituicaoId).pipe(
      map((students: Student[]) => {
        return students.map(student => {
          // Extrair nome e sobrenome do nome completo
          const nameParts = student.name.split(' ');
          const nome = nameParts[0] || '';
          const sobrenome = nameParts.slice(1).join(' ') || '';
          
          return {
            id: student.id,
            nome: nome,
            sobrenome: sobrenome,
            email: student.email,
            dataNascimento: student.date_of_birth,
            telefone: student.contact_phone
          };
        });
      })
    );
  }

  // Mantemos o método original para compatibilidade com código existente,
  // agora ele apenas chama o novo método com um ID fixo
  listarAlunos(): Observable<any[]> {
    return this.listarAlunosPorInstituicao(306);
  }

  criarAluno(aluno: any): Observable<any> {
    return this.http.post(this.apiUrl, aluno).pipe(
      catchError(error => {
        console.error('Erro ao criar aluno:', error);
        return of(null);
      })
    );
  }

  deletarAluno(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao deletar aluno:', error);
        return of(null);
      })
    );
  }

  getAluno(id: string): Observable<any> {
    return this.schoolApiService.getStudentById(parseInt(id)).pipe(
      map((student: Student) => {
        // Extrair nome e sobrenome do nome completo
        const nameParts = student.name.split(' ');
        const nome = nameParts[0] || '';
        const sobrenome = nameParts.slice(1).join(' ') || '';
        
        return {
          id: student.id.toString(),
          nome: nome,
          sobrenome: sobrenome,
          nomeCompleto: student.name,
          dataNascimento: student.date_of_birth,
          email: student.email,
          telefone: student.contact_phone,
          instituicaoEnsino: '', // Será preenchido com dados das matrículas
          tipoDeficiencia: '', // Campo não disponível na API
          observacoes: '' // Campo não disponível na API
        };
      })
    );
  }

  atualizarAluno(id: string, aluno: any): Observable<any> {
    // Como a API externa não fornece endpoint para atualização,
    // essa seria uma função mock que simula o sucesso
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 500);
    });
  }
  
  getMatriculasAluno(id: string): Observable<any[]> {
    return this.schoolApiService.getEnrollmentsByStudent(parseInt(id));
  }
}