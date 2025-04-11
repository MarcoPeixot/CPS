import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class SchoolApiService {
  private baseUrl = environment.apiUrl;
  private token = environment.apiToken;
  
  constructor(private http: HttpClient) {}
  
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  }
  
  getInstitutions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/institutions`, { headers: this.getHeaders() });
  }
  
  getInstitutionById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/institutions/${id}`, { headers: this.getHeaders() });
  }
  
  getStudentsByInstitution(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/institutions/${id}/students`, { headers: this.getHeaders() });
  }
  
  getStudentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/students/${id}`, { headers: this.getHeaders() });
  }
  
  getEnrollmentsByStudent(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/students/${id}/enrollments`, { headers: this.getHeaders() });
  }
  
  getCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses`, { headers: this.getHeaders() });
  }
  
  getCourseById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses/${id}`, { headers: this.getHeaders() });
  }
  
  getStudentsByCourse(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses/${id}/students`, { headers: this.getHeaders() });
  }
  
  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`, { headers: this.getHeaders() });
  }
}