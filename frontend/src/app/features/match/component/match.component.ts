import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfissionalService } from '../services/profissional.service';
import { AlunoProfissionalService } from '../services/aluno-profissional.service';
import { AlunoService } from '../services/aluno.service';
import { NavbarComponent } from "../../../shared/navbar/navbar.component";
import { SchoolApiService } from '../../../core/services/school-api.service';
import { Student } from '../../../models/student.model';

interface Profissional {
  id: number;
  nome: string;
  especialidade?: string;
}

interface Aluno {
  id: string;
  nome: string;
  sobrenome: string;
  nomeCompleto: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  instituicaoEnsino: string;
  tipoDeficiencia: string;
  observacoes: string;
}

interface Especialidade {
  id: number;
  nome: string;
}

interface Matricula {
  id: number;
  course_name: string;
  enrollment_date: string;
  status: string;
}

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent
  ]
})

export class MatchComponent implements OnInit {
  matchForm: FormGroup;
  alunoId: string;
  alunoData: Aluno | null = null;
  alunoNome: string = 'Carregando...';
  alunoMatriculas: Matricula[] = [];
  profissionais: Profissional[] = [];
  profissionaisFiltrados: Profissional[] = [];

  profissionalSelecionado: Profissional | null = null;
  searchText: string = '';
  showOptions: boolean = false;
  showSuccessMessage: boolean = false;
  especialidadesSelecionadas: string[] = [];
  
  // Propriedades para o dropdown de especialidades
  showEspecialidadesDropdown: boolean = false;
  especialidadeSearchText: string = '';
  especialidadesFiltradas: Especialidade[] = [];
  carregando: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profissionalService: ProfissionalService,
    private alunoProfissionalService: AlunoProfissionalService,
    private alunoService: AlunoService,
    private schoolApiService: SchoolApiService
  ) {
    this.alunoId = '';
    
    this.matchForm = this.fb.group({
      alunoId: ['', Validators.required],
      profissionalId: ['', Validators.required],
      dataInicio: [this.getFormattedDateTime(), Validators.required],
      dataFim: [''],
      descricao: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.alunoId = params['id']; // Pegando o ID como string
      if (this.alunoId) {
        this.matchForm.patchValue({ alunoId: this.alunoId });
        this.carregarDadosAluno();
        this.carregarMatriculasAluno();
        this.carregarProfissionais();
      } else {
        // Redirecionamento se não tiver ID do aluno
        this.router.navigate(['/alunos']);
      }
    });

    // Adicionar dados mockados para caso não haja conexão com a API
    setTimeout(() => {
      if (this.profissionais.length === 0) {
        this.profissionais = this.getMockProfissionais();
        this.profissionaisFiltrados = [...this.profissionais];
      }
      this.carregando = false;
    }, 1000);

    // Inicializar lista filtrada de especialidades
    this.especialidadesFiltradas = [...this.especialidades];

    // Adicionar listener para fechar as opções quando clicar fora
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container') && !target.closest('.search-select-container')) {
        this.showEspecialidadesDropdown = false;
        this.showOptions = false;
      }
    });
  }

  especialidades: Especialidade[] = [
    { id: 1, nome: 'Psicologia' },
    { id: 2, nome: 'Fonoaudiologia' },
    { id: 3, nome: 'Terapia Ocupacional' },
    { id: 4, nome: 'Neuropsicologia' },
    { id: 5, nome: 'Psicopedagogia' },
    { id: 6, nome: 'Fisioterapia' },
    { id: 7, nome: 'Terapia ABA' },
    { id: 8, nome: 'Neurologia' },
    { id: 9, nome: 'Pediatria' },
    { id: 10, nome: 'Psiquiatria' },
    { id: 11, nome: 'Nutrição' },
    { id: 12, nome: 'Musicoterapia' },
    { id: 13, nome: 'Arteterapia' },
    { id: 14, nome: 'Educação Especial' },
    { id: 15, nome: 'Assistência Social' }
  ];
  
  private getFormattedDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  carregarDadosAluno(): void {
    this.carregando = true;
    this.alunoService.getAluno(this.alunoId).subscribe({
      next: (aluno: Aluno) => {
        this.alunoData = aluno;
        this.alunoNome = aluno.nomeCompleto;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do aluno:', error);
        this.alunoNome = 'Aluno #' + this.alunoId;
        this.carregando = false;
      }
    });
  }

  carregarMatriculasAluno(): void {
    this.alunoService.getMatriculasAluno(this.alunoId).subscribe({
      next: (matriculas: Matricula[]) => {
        this.alunoMatriculas = matriculas;
        
        // Atualizar instituição de ensino no objeto aluno, se disponível
        if (this.alunoData && matriculas.length > 0) {
          const instituicoes = new Set(matriculas.map(m => m.course_name));
          this.alunoData.instituicaoEnsino = Array.from(instituicoes).join(', ');
        }
      },
      error: (error) => {
        console.error('Erro ao carregar matrículas do aluno:', error);
      }
    });
  }
  carregarProfissionais(): void {
    this.profissionalService.listarProfissionais().subscribe({
      next: (data: Profissional[]) => {
        this.profissionais = data;
        this.profissionaisFiltrados = [...this.profissionais];
      },
      error: (error) => {
        console.error('Erro ao carregar profissionais:', error);
        this.profissionais = this.getMockProfissionais();
        this.profissionaisFiltrados = [...this.profissionais];
      }
    });
  }

  getMockProfissionais(): Profissional[] {
    return [
      { id: 1, nome: 'Maria Silva', especialidade: 'Psicologia' },
      { id: 2, nome: 'João Santos', especialidade: 'Fonoaudiologia' },
      { id: 3, nome: 'Ana Oliveira', especialidade: 'Terapia Ocupacional' },
      { id: 4, nome: 'Carlos Pereira', especialidade: 'Neuropsicologia' },
      { id: 5, nome: 'Patricia Souza', especialidade: 'Psicopedagogia' }
    ];
  }

  selecionarProfissional(profissional: Profissional): void {
    this.profissionalSelecionado = profissional;
    this.matchForm.patchValue({ profissionalId: profissional.id });
    this.searchText = profissional.nome;
    this.showOptions = false;
  }

  removerProfissionalSelecionado(): void {
    this.profissionalSelecionado = null;
    this.matchForm.patchValue({ profissionalId: '' });
    this.searchText = '';
  }

  salvarMatch(): void {
    if (this.matchForm.valid) {
      const matchData = this.matchForm.value;
      
      this.alunoProfissionalService.associarAlunoProfissional(
        matchData.alunoId,
        matchData.profissionalId
      ).subscribe({
        next: (response) => {
          console.log('Associação criada com sucesso:', response);
          this.showSuccessMessage = true;
          
          // Esconder a mensagem após 3 segundos
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.voltarParaLista();
          }, 3000);
        },
        error: (error) => {
          console.error('Erro ao criar associação:', error);
          // Mesmo com erro, vamos simular sucesso para teste do frontend
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.voltarParaLista();
          }, 3000);
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.matchForm.controls).forEach(key => {
        const control = this.matchForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  // Métodos para o gerenciamento das especialidades
  toggleEspecialidadesDropdown(): void {
    this.showEspecialidadesDropdown = !this.showEspecialidadesDropdown;
    if (this.showEspecialidadesDropdown) {
      this.filtrarEspecialidades();
    }
  }

  filtrarEspecialidades(): void {
    const searchTerm = this.especialidadeSearchText.toLowerCase().trim();
    this.especialidadesFiltradas = this.especialidades.filter(esp => 
      esp.nome.toLowerCase().includes(searchTerm)
    );
  }

  isEspecialidadeSelecionada(nome: string): boolean {
    return this.especialidadesSelecionadas.includes(nome);
  }

  limparEspecialidades(): void {
    this.especialidadesSelecionadas = [];
    this.aplicarFiltro();
  }

  onEspecialidadeChange(especialidade: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.especialidadesSelecionadas.push(especialidade);
    } else {
      this.especialidadesSelecionadas = this.especialidadesSelecionadas.filter(
        e => e !== especialidade
      );
    }
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    const searchLower = this.searchText.toLowerCase().trim();
  
    this.profissionaisFiltrados = this.profissionais.filter(prof => {
      const nomeMatch = prof.nome.toLowerCase().includes(searchLower);
      const especialidadeMatch = this.especialidadesSelecionadas.length === 0
        || (prof.especialidade && this.especialidadesSelecionadas.includes(prof.especialidade));
      
      return nomeMatch && especialidadeMatch;
    });
  }
  
  filtrarProfissionais(): void {
    this.aplicarFiltro();
    this.showOptions = true;
  }

  toggleProfissionaisDropdown(): void {
    this.showOptions = !this.showOptions;
    if (this.showOptions) {
      this.filtrarProfissionais();
    }
  }

  voltarParaLista(): void {
    this.router.navigate(['/aluno-list', this.alunoId]);
  }

  cancelar(): void {
    this.router.navigate(['/aluno-list', this.alunoId]);
  }
  
  formatarData(data: string): string {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  }
}