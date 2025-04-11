import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProfissionalService, Profissional } from '../services/profissional.service';

@Component({
  selector: 'app-perfil-profissional',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './perfil-profissional.component.html',
  styleUrls: ['./perfil-profissional.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PerfilProfissionalComponent implements OnInit {
  profissional: Profissional = {
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    empresa: '',
    especialidadePrincipal: '',
    especialidades: [],
    observacoes: '',
  };

  // Dados mockados de atendimentos
  profissionalAtendimentos = [
    {
      id: '1',
      aluno: { 
        id: '101', 
        nome: 'Ana Silva',
        deficiencia: 'TEA - Transtorno do Espectro Autista'
      },
      dataInicio: '2023-01-15',
      dataFim: null,
      observacoes: 'Atendimento semanal - quarta-feira às 14h'
    },
    {
      id: '2',
      aluno: { 
        id: '102', 
        nome: 'Lucas Pereira',
        deficiencia: 'Deficiência Física'
      },
      dataInicio: '2023-02-10',
      dataFim: null,
      observacoes: 'Atendimento quinzenal - sexta-feira às 16h'
    },
    {
      id: '3',
      aluno: { 
        id: '103', 
        nome: 'Mariana Santos',
        deficiencia: 'Deficiência Auditiva'
      },
      dataInicio: '2023-03-05',
      dataFim: null,
      observacoes: 'Atendimento mensal - segunda-feira às 10h'
    }
  ];

  especialidades = [
    {
      id: 1,
      nome: 'Sindrome de Down',
    },
    {
      id: 2,
      nome: 'Autismo',
    },
    {
      id: 3,
      nome: 'Deficiência Auditiva',
    }
  ];

  activeTab = 'pessoal';
  
  atendimentoEmEdicao: any = null;
  isInputFocused = false;
  formInvalid = false;
  errorMessage = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private profissionalService: ProfissionalService
  ) {}

  ngOnInit(): void {
    // Obter o ID do profissional da URL
    this.route.params.subscribe(params => {
      const profissionalId = +params['id']; // Convertendo para número
      if (profissionalId) {
        this.carregarPerfilProfissional(profissionalId);
      }
    });

    setTimeout(() => {
      document.querySelector('.profile-container')?.classList.add('show');
    }, 100);
  }

  carregarPerfilProfissional(id: number): void {
    this.loading = true;
    this.profissionalService.obterPerfilProfissional(id).subscribe({
      next: (data) => {
        if (data && data.nome) {
          // Preencher os dados do profissional com os dados da API
          this.profissional = {
            id: data.id || 0,
            nome: data.nome || '',
            email: data.email || '',
            telefone: data.telefone || '',
            cpfCnpj: data.cpfCnpj || '',
            empresa: data.empresa || '',
            especialidadePrincipal: data.especialidadePrincipal || '',
            especialidades: data.especialidades || [],
            observacoes: data.observacoes || '',
          };
          console.log('Dados carregados:', this.profissional);
        } else {
          this.errorMessage = 'Perfil não encontrado ou dados incompletos.';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil do profissional:', error);
        this.errorMessage = 'Não foi possível carregar os dados do profissional.';
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  salvarAlteracoes(): void {
    console.log('Salvando alterações:', this.profissional);
    
    this.profissionalService.atualizarProfissional(this.profissional.id, this.profissional)
      .subscribe({
        next: (resposta) => {
          console.log('Profissional atualizado com sucesso:', resposta);
          this.showSaveConfirmation();
        },
        error: (erro) => {
          console.error('Erro ao atualizar profissional:', erro);
          this.errorMessage = 'Não foi possível salvar as alterações. Tente novamente mais tarde.';
        }
      });
  }

  cancelar(): void {
    console.log('Operação cancelada');
    // Recarregar os dados originais do profissional
    this.carregarPerfilProfissional(this.profissional.id);
  }

  excluirAtendimento(atendimentoId: string): void {
    if (confirm('Tem certeza que deseja excluir este atendimento?')) {
      this.profissionalAtendimentos = this.profissionalAtendimentos.filter(a => a.id !== atendimentoId);
      console.log('Atendimento excluído com sucesso');
    }
  }

  visualizarAluno(alunoId: string): void {
    console.log('Visualizar detalhes do aluno:', alunoId);
    const alunoSelecionado = this.profissionalAtendimentos.find(p => p.id === alunoId);
    if (alunoSelecionado) {
      console.log('Dados do aluno:', alunoSelecionado);
    }
  }

  setInputFocus(isFocused: boolean): void {
    this.isInputFocused = isFocused;
  }

  showSaveConfirmation(): void {
    this.formInvalid = false;
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Dados salvos com sucesso!';
    
    document.querySelector('.profile-container')?.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      successMessage.classList.remove('show');
      setTimeout(() => {
        successMessage.remove();
      }, 300);
    }, 3000);
  }
}