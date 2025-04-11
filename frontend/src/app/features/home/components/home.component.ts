import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { AuthService } from '@auth0/auth0-angular';
import { AlunoService } from '../../perfil-aluno/services/aluno.service';
import { ProfissionalService } from '../../cadastro-profissional/services/profissional.service';
import { DashboardService } from '../../dashboard/services/dashboard.services';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  userName: string = 'Usuário';
  isAuthenticated: boolean = false;
  isLoading: boolean = true;
  totalAlunos: number = 0;
  totalProfissionais: number = 0;
  totalMatches: number = 0;
  totalEspecialidades: number = 0;
  totalCursos: number = 0;
  totalAtendidos: number = 0;
  profissionaisPorEspecialidade: { especialidade: string; total: number }[] = [];
  alunosPorAno: Record<string, number> = {};
  totalDeficiencias: number = 0;
  anoAtual: number = new Date().getFullYear();
  myChart: Chart | undefined;


  @ViewChild('chartAtendidos', { static: false }) chartAtendidos!: ElementRef;
  @ViewChild('chartEspecialidades') chartEspecialidades!: ElementRef;
  @ViewChild('profissionaisEspecialidadeChart') profissionaisEspecialidadeChart!: ElementRef;

  constructor(
    public auth: AuthService,
    private alunoService: AlunoService,
    private profissionalService: ProfissionalService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userName = user.name || user.email || 'Usuário';
        this.isAuthenticated = true;
        this.carregarDados();
      }
    });

    this.auth.isAuthenticated$.subscribe(isAuth => {
      if (!isAuth) {
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Gráficos serão renderizados em carregarDados()
  }

  get porcentagemAtendidos(): string {
    if (this.totalAlunos === 0) return '0%';
    const porcentagem = (this.totalAtendidos / this.totalAlunos) * 100;
    return `${porcentagem.toFixed(1)}%`;
  }

  carregarDados(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.totalAlunos = stats.totalAlunos;
        this.totalProfissionais = stats.totalProfissionais;
        this.totalMatches = stats.totalAtendidos;
        this.totalAtendidos = stats.totalAtendidos;
        this.alunosPorAno = stats.alunosPorAno;
        this.totalDeficiencias = Object.keys(stats.deficiencias || {}).length;
        this.totalEspecialidades = stats.totalEspecialidades;
        this.totalCursos = stats.totalCursos;
        this.profissionaisPorEspecialidade = stats.profissionaisPorEspecialidade || [];
        this.isLoading = false;
        this.renderChart(); // agora o gráfico de especialidades
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas:', err);
        this.isLoading = false;
      }
    });
  }

  renderChart(): void {
    if (!this.chartAtendidos?.nativeElement || !this.profissionaisPorEspecialidade.length) return;
  
    const ctx = this.chartAtendidos.nativeElement.getContext('2d');
  
    const labels = this.profissionaisPorEspecialidade.map(item => item.especialidade);
    const data = this.profissionaisPorEspecialidade.map(item => item.total);
  
    if (this.myChart) {
      this.myChart.destroy();
    }
  
    this.myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'Profissionais por Especialidade',
          data,
          backgroundColor: [
            '#4C7EFF',
            '#FFC24C',
            '#FF6F91',
            '#9ACD32',
            '#7ED6DF',
            '#8A29E6',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'right'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }
  

  renderEspecialidadesChart(): void {
    if (!this.chartEspecialidades) return;

    const labels = this.profissionaisPorEspecialidade.map(p => p.especialidade);
    const data = this.profissionaisPorEspecialidade.map(p => p.total);

    new Chart(this.chartEspecialidades.nativeElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Profissionais por Especialidade',
          data,
          backgroundColor: '#4C7EFF'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y} profissionais`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  carregarTotalAlunos(): void {
    this.alunoService.listarAlunos().subscribe({
      next: (alunos) => {
        this.totalAlunos = alunos.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar alunos:', err);
        this.isLoading = false;
      }
    });
  }

  carregarTotalProfissionais(): void {
    this.profissionalService.listarProfissionais().subscribe({
      next: (profissionais) => {
        this.totalProfissionais = profissionais.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar profissionais:', err);
        this.isLoading = false;
      }
    });
  }
}
