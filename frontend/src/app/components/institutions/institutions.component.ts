import { Component, OnInit } from '@angular/core';
import { SchoolApiService } from '../../core/services/school-api.service';
import { CommonModule } from '@angular/common'; // Importando o CommonModule

@Component({
  selector: 'app-institutions',
  standalone: true, // Isso permite o uso de módulos standalone
  imports: [CommonModule], // Adicionando o CommonModule aqui
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.scss']
})
export class InstitutionsComponent implements OnInit {
  institutions: any[] = [];

  constructor(private schoolApi: SchoolApiService) {}

  ngOnInit(): void {
    this.schoolApi.getInstitutions().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.institutions = data;
      },
      error: (err) => console.error('Erro ao buscar instituições:', err)
    });
  }
}
