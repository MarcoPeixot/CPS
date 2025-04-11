import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeficienciaService {
  private apiUrl = 'https://two025-1a-t13-es05-g04.onrender.com/deficiencia';

  constructor(private http: HttpClient) { }

  listarDeficiencias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.warn('Erro ao buscar deficiências na API. Retornando mock:', error);
        return of([
          { nome: 'TEA - Transtorno do Espectro Autista' },
          { nome: 'Deficiência Física' },
          { nome: 'Deficiência Visual' },
          { nome: 'Deficiência Auditiva' },
          { nome: 'Deficiência Intelectual' }
        ]);
      })
    );
  }
}