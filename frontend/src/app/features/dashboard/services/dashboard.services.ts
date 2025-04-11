import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SchoolApiService } from '../../../core/services/school-api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private schoolApi: SchoolApiService,
    private http: HttpClient
  ) {}

  getDashboardStats(): Observable<any> {
    return forkJoin([
      this.schoolApi.getStats(),
      this.http.get<any>('https://two025-1a-t13-es05-g04.onrender.com/stats')
    ]).pipe(
      map(([apiData, localData]) => {
        console.log('API Data:', apiData);
        console.log('Local Data:', localData);
  
        return {
          totalAlunos: apiData.total_students,
          totalProfissionais: localData.totalProfissionais,
          totalAtendidos: localData.totalAtendidos,
          alunosPorAno: localData.alunosPorAno,
          deficiencias: localData.deficiencias,
          totalCursos: apiData.total_courses,
          totalMatriculas: apiData.total_enrollments,
          matriculasPorInstituicao: apiData.enrollments_per_institution,
          totalEspecialidades: localData.totalEspecialidades,
          profissionaisPorEspecialidade: localData.profissionaisPorEspecialidade
        };
      })
    );
  }  
}
