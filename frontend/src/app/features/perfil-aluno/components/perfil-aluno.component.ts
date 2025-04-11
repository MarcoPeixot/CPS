import { Component, OnInit, TemplateRef} from '@angular/core';
import { CommonModule, NgIfContext } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { AlunoService } from '../services/aluno.service';
import { DeficienciaService } from '../services/deficiencia.service';
import { forkJoin } from 'rxjs';
import { Enrollment } from '../../../models/enrollment.model';

@Component({
  selector: 'app-perfil-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './perfil-aluno.component.html',
  styleUrls: ['./perfil-aluno.component.scss']
})
export class PerfilAlunoComponent implements OnInit {
  aluno = {
    id: '',
    nome: '',
    idade: 0,
    dataNascimento: '',
    email: '',
    telefone: '',
    tipoDeficiencia: '',
    instituicaoEnsino: '',
    observacoes: ''
  };

  matriculas: Enrollment[] = [];
  activeTab = 'info';
  tiposDeficiencia: string[] = [];
  loading = true;


  alunoId: number = 0;

  alunoAtendimentos = [
    {
      id: '1',
      profissional: { 
        id: '101', 
        nome: 'Dr. Carlos Mendes',
        especialidade: 'Psicólogo'
      },
      dataInicio: '2023-01-15',
      dataFim: null,
      observacoes: 'Atendimento semanal - quarta-feira às 14h'
    },
    {
      id: '2',
      profissional: { 
        id: '102', 
        nome: 'Dra. Patrícia Lima',
        especialidade: 'Fonoaudióloga'
      },
      dataInicio: '2022-08-10',
      dataFim: '2022-12-20',
      observacoes: 'Atendimento quinzenal concluído'
    },
    {
      id: '3',
      profissional: { 
        id: '103', 
        nome: 'Dr. Ricardo Santos',
        especialidade: 'Terapeuta Ocupacional'
      },
      dataInicio: '2023-03-05',
      dataFim: null,
      observacoes: 'Atendimento semanal - segunda-feira às 10h'
    }
  ];

  atendimentoEmEdicao: any = null;
  semAtendimentos!: TemplateRef<NgIfContext<boolean>> | null;
  semProfissionais!: TemplateRef<NgIfContext<boolean>> | null;


  constructor(
    private route: ActivatedRoute,
    private alunoService: AlunoService,
    private deficienciaService: DeficienciaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Converter para número se seu backend espera um number
      this.carregarDadosAluno(id);
      this.carregarDeficiencias();
    } else {
      console.error("ID do aluno não foi fornecido na rota");
      // Adicione algum feedback visual para o usuário
      this.loading = false;
    }
  }

  carregarDadosAluno(id: string): void {
    forkJoin({
      aluno: this.alunoService.getAluno(id),
      matriculas: this.alunoService.getMatriculasAluno(id)
    }).subscribe({
      next: (result) => {
        this.aluno = result.aluno;
        this.matriculas = result.matriculas;
        
        // Preencher instituição de ensino com a última matrícula ativa
        const matriculaAtiva = this.matriculas.find(m => m.status === 'active');
        if (matriculaAtiva) {
          this.aluno.instituicaoEnsino = matriculaAtiva.institution_name;
        } else if (this.matriculas.length > 0) {
          this.aluno.instituicaoEnsino = this.matriculas[0].institution_name;
        }
        
        this.aluno.idade = this.calcularIdade(this.aluno.dataNascimento);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do aluno:', err);
        this.loading = false;
      }
    });
  }

  carregarDeficiencias(): void {
    this.deficienciaService.listarDeficiencias().subscribe({
      next: (deficiencias) => {
        this.tiposDeficiencia = deficiencias.map((d: any) => d.nome);
      },
      error: (err) => {
        console.error('Erro ao carregar deficiências:', err);
        this.tiposDeficiencia = [
          'TEA - Transtorno do Espectro Autista',
          'Deficiência Física',
          'Deficiência Visual',
          'Deficiência Auditiva',
          'Deficiência Intelectual'
        ];
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  salvarAlteracoes(): void {
    this.alunoService.atualizarAluno(this.aluno.id, this.aluno).subscribe({
      next: () => {
        alert('Alterações salvas com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar alterações:', err);
        alert('Erro ao salvar alterações');
      }
    });
  }

  cancelar(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarDadosAluno(id);
    }
  }

  calcularIdade(dataNascimento: string): number {
    if (!dataNascimento) return 0;
    
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }

  editarAtendimento(atendimentoId: string): void {
    console.log('Editar atendimento:', atendimentoId);
    this.atendimentoEmEdicao = this.alunoAtendimentos.find(a => a.id === atendimentoId);

    if (this.atendimentoEmEdicao) {
      console.log('Dados do atendimento para edição:', this.atendimentoEmEdicao);
    }
  }

  novoAtendimento(id: string): void {
    console.log('Novo atendimento para o aluno:', id);
    this.router.navigate(['/match', id]);
  }

  formatarData(data: string): string {
    if (!data) return '';
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR');
  }
}