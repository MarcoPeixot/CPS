import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AlunoService } from '../../perfil-aluno/services/aluno.service'; 
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { SchoolApiService } from '../../../core/services/school-api.service';

interface Aluno {
  id: number;
  nome: string;
  sobrenome: string;
  email?: string;
  dataNascimento?: string;
  telefone?: string;
}

interface Instituicao {
  id: number;
  name: string;
  city?: string;
  state?: string;
  country?: string;
}

@Component({
  selector: 'app-main-aluno',
  templateUrl: './main-aluno.component.html',
  styleUrls: ['./main-aluno.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent]
})
export class MainAlunoComponent implements OnInit {
  // Arrays e variáveis para o gerenciamento de instituições
  instituicoes: Instituicao[] = [];
  instituicoesFiltradas: Instituicao[] = [];
  termoPesquisaInstituicao: string = '';
  instituicaoSelecionadaId: number | null = null;
  loadingInstitutions = true;
  errorInstitutions = false;
  isInstitutionInputFocused = false;
  
  // Arrays e variáveis para o gerenciamento de alunos
  alunos: Aluno[] = [];
  alunosFiltrados: Aluno[] = [];
  termoPesquisa: string = '';
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 1;
  isInputFocused = false;
  loading = false;
  error = false;
  
  constructor(
    private alunoService: AlunoService,
    private schoolApiService: SchoolApiService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.carregarInstituicoes();
  }
  
  carregarInstituicoes(): void {
    this.loadingInstitutions = true;
    this.errorInstitutions = false;
    
    this.schoolApiService.getInstitutions().subscribe({
      next: (dados) => {
        this.instituicoes = dados;
        this.pesquisarInstituicoes(); // Aplica o filtro inicial (mostra todas)
        this.loadingInstitutions = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar instituições:', erro);
        this.loadingInstitutions = false;
        this.errorInstitutions = true;
      }
    });
  }
  
  pesquisarInstituicoes(): void {
    if (!this.termoPesquisaInstituicao.trim()) {
      this.instituicoesFiltradas = [...this.instituicoes];
      return;
    }
    
    const termo = this.termoPesquisaInstituicao.toLowerCase().trim();
    this.instituicoesFiltradas = this.instituicoes.filter(instituicao => {
      const nome = instituicao.name.toLowerCase();
      const cidade = instituicao.city?.toLowerCase() || '';
      const estado = instituicao.state?.toLowerCase() || '';
      
      return nome.includes(termo) || cidade.includes(termo) || estado.includes(termo);
    });
  }
  
  selecionarInstituicao(id: number): void {
    this.instituicaoSelecionadaId = id;
    this.carregarAlunos();
  }
  
  voltarParaInstituicoes(): void {
    this.instituicaoSelecionadaId = null;
    this.alunos = [];
    this.alunosFiltrados = [];
  }
  
  getInstituicaoNome(): string {
    const instituicao = this.instituicoes.find(i => i.id === this.instituicaoSelecionadaId);
    return instituicao ? instituicao.name : 'Instituição Selecionada';
  }
  
  carregarAlunos(): void {
    if (!this.instituicaoSelecionadaId) return;
    
    this.loading = true;
    this.error = false;
    this.paginaAtual = 1;
    
    this.alunoService.listarAlunosPorInstituicao(this.instituicaoSelecionadaId).subscribe({
      next: (dados) => {
        this.alunos = dados;
        this.calcularTotalPaginas();
        this.aplicarPaginacao();
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar alunos:', erro);
        this.loading = false;
        this.error = true;
      }
    });
  }
  
  calcularTotalPaginas(): void {
    const alunosFiltrados = this.filtrarAlunos();
    this.totalPaginas = Math.ceil(alunosFiltrados.length / this.itensPorPagina);
    if (this.totalPaginas === 0) this.totalPaginas = 1;
  }
  
  aplicarPaginacao(): void {
    const alunosFiltrados = this.filtrarAlunos();
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.alunosFiltrados = alunosFiltrados.slice(inicio, fim);
  }
  
  filtrarAlunos(): Aluno[] {
    if (!this.termoPesquisa.trim()) {
      return this.alunos;
    }
    const termo = this.termoPesquisa.toLowerCase().trim();
    return this.alunos.filter(aluno => {
      const nomeCompleto = `${aluno.nome} ${aluno.sobrenome}`.toLowerCase();
      const email = aluno.email?.toLowerCase() || '';
      return nomeCompleto.includes(termo) || email.includes(termo);
    });
  }
  
  pesquisarAlunos(): void {
    this.paginaAtual = 1;
    this.calcularTotalPaginas();
    this.aplicarPaginacao();
  }
  
  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.aplicarPaginacao();
    }
  }
  
  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.aplicarPaginacao();
    }
  }
  
  visualizarAluno(id: number): void {
    this.router.navigate(['/perfil-aluno', id]);
  }
  
  tentarNovamente(): void {
    this.carregarAlunos();
  }
  
  getNomeCompleto(aluno: Aluno): string {
    return `${aluno.nome} ${aluno.sobrenome}`.trim();
  }
}