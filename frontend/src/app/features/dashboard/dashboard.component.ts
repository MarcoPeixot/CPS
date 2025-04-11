import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit
  } from '@angular/core';
  import { DashboardService } from './services/dashboard.services';
  import { Chart } from 'chart.js';
  import { CommonModule } from '@angular/common';
  import { NavbarComponent } from '../../shared/navbar/navbar.component';
  
  import {
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    DoughnutController,
    ArcElement,
    LineController,
    LineElement,
    PointElement
  } from 'chart.js';
  
  Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    DoughnutController,
    ArcElement,
    LineController,
    LineElement,
    PointElement
  );
  
  @Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
  })
  export class DashComponent implements AfterViewInit, OnInit {
    @ViewChild('alunosProfissionaisChart') alunosProfissionaisChart!: ElementRef;
    @ViewChild('alunosAtendidosChart') alunosAtendidosChart!: ElementRef;
    @ViewChild('alunosPorAnoChart') alunosPorAnoChart!: ElementRef;
    @ViewChild('deficienciasBarChart') deficienciasBarChart!: ElementRef;
    @ViewChild('deficienciasPieChart') deficienciasPieChart!: ElementRef;
    @ViewChild('profissionaisEspecialidadeChart') profissionaisEspecialidadeChart!: ElementRef;
  
    dashboardData: any;
  
    constructor(private dashboardService: DashboardService) {}
  
    ngOnInit() {
      this.dashboardService.getDashboardStats().subscribe(data => {
        this.dashboardData = data;
        console.log('Dashboard Data:', data); // debug geral
        this.renderAllCharts();
      });
    }
  
    ngAfterViewInit() {
      // Gráficos serão renderizados depois de receber os dados
    }
  
    renderAllCharts() {
      this.renderAlunosProfissionaisChart();
      this.renderAlunosAtendidosChart();
      this.renderAlunosPorAnoChart();
      this.renderDeficienciasBarChart();
      this.renderDeficienciasPieChart();
    }
  
    renderAlunosProfissionaisChart() {
      const ctx = this.alunosProfissionaisChart.nativeElement.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Alunos', 'Profissionais'],
          datasets: [{
            label: 'Quantidade',
            data: [this.dashboardData.totalAlunos, this.dashboardData.totalProfissionais],
            backgroundColor: ['#4C7EFF', '#FFC24C']
          }]
        }
      });
    }
  
    renderAlunosAtendidosChart() {
      const ctx = this.alunosAtendidosChart.nativeElement.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Alunos', 'Atendidos'],
          datasets: [{
            data: [this.dashboardData.totalAlunos, this.dashboardData.totalAtendidos],
            backgroundColor: ['#4C7EFF', '#9ACD32']
          }]
        }
      });
    }
  
    renderAlunosPorAnoChart() {
      const labels = Object.keys(this.dashboardData.alunosPorAno || {});
      const values = Object.values(this.dashboardData.alunosPorAno || {});
  
      const ctx = this.alunosPorAnoChart.nativeElement.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Alunos por Ano',
            data: values,
            borderColor: '#A0C340',
            backgroundColor: '#8A29E6',
            fill: false,
            tension: 0.2
          }]
        }
      });
    }
  
    renderDeficienciasBarChart() {
      const labels = Object.keys(this.dashboardData.deficiencias || {});
      const values = Object.values(this.dashboardData.deficiencias || {});
  
      const ctx = this.deficienciasBarChart.nativeElement.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Quantidade por Deficiência',
            data: values,
            backgroundColor: '#8A29E6'
          }]
        }
      });
    }
  
    renderDeficienciasPieChart() {
      const labels = Object.keys(this.dashboardData.deficiencias || {});
      const values = Object.values(this.dashboardData.deficiencias || {});
  
      const ctx = this.deficienciasPieChart.nativeElement.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: [
              '#8A29E6', '#4C7EFF', '#FFC24C', '#FF6F91', '#7ED6DF'
            ]
          }]
        }
      });
    }
  }