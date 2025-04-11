import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { EspecialidadeService } from '../services/especialidade.service';
import { ProfissionalService } from '../services/profissional.service';


interface EspecialidadeAdicional {
  id: string;
  nome: string;
  selecionado: boolean;
}

interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  empresa: string;
  especialidade: string;
  observacoes: string;
  especialidades: string[];
  disponibilidade: any;
}

@Component({
  selector: 'app-visualizar-profissional', // Corrigido para match com o template
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './visualizar-profissional.component.html', // Verifique se o caminho está correto
  styleUrls: ['./visualizar-profissional.component.scss']
})
export class VisualizarProfissionalComponent implements OnInit {
  profissional: Profissional = {
    id: '',
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    empresa: '',
    especialidade: '',
    observacoes: '',
    especialidades: [],
    disponibilidade: {}
  };

  activeTab = 'pessoal';
  loading = false;
  
  especialidades: string[] = [];
  especialidadesAdicionais: EspecialidadeAdicional[] = [];

  constructor(
    private especialidadeService: EspecialidadeService,
    private profissionalService: ProfissionalService
  ) {}

  ngOnInit(): void {
    this.carregarEspecialidades();
    this.carregarEspecialidadesAdicionais();
  }

  carregarEspecialidades(): void {
    this.especialidadeService.listarEspecialidades().subscribe({
      next: (response) => {
        console.log('Resposta da API:', response); // Adicione este log
        // Se for array de objetos, mapeie para pegar os nomes
        this.especialidades = Array.isArray(response) 
          ? response.map((esp: any) => esp.nome || esp.descricao || esp.titulo)
          : [];
      },
      error: (err) => {
        console.error('Erro ao carregar especialidades:', err);
        this.especialidades = [];
      }
    });
  }

  carregarEspecialidadesAdicionais(): void {
    // Simulando carga de especialidades adicionais
    // Na prática, você buscaria isso de um serviço
    this.especialidadesAdicionais = [
      { id: '1', nome: 'Neuropsicologia', selecionado: false },
      { id: '2', nome: 'Psicopedagogia', selecionado: false },
      { id: '3', nome: 'Terapia Cognitivo-Comportamental', selecionado: false }
    ];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  salvar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    
    const dadosProfissional = {
      ...this.profissional,
      especialidades: this.getEspecialidadesSelecionadas()
    };

    this.profissionalService.criarProfissional(dadosProfissional).subscribe({
      next: () => {
        alert('Profissional cadastrado com sucesso!');
        this.loading = false;
        this.resetarFormulario();
      },
      error: (err) => {
        console.error('Erro ao cadastrar profissional:', err);
        alert('Erro ao cadastrar profissional');
        this.loading = false;
      }
    });
  }

  private validarFormulario(): boolean {
    if (!this.profissional.nome) {
      alert('O nome é obrigatório');
      return false;
    }

    if (this.activeTab === 'profissional' && !this.profissional.empresa) {
      alert('A empresa é obrigatória');
      return false;
    }

    return true;
  }

  private getEspecialidadesSelecionadas(): string[] {
    return [
      this.profissional.especialidade,
      ...this.especialidadesAdicionais
        .filter(esp => esp.selecionado)
        .map(esp => esp.nome)
    ].filter(Boolean);
  }

  cancelar(): void {
    if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      this.resetarFormulario();
    }
  }

  private resetarFormulario(): void {
    this.profissional = {
      id: '',
      nome: '',
      email: '',
      telefone: '',
      cpfCnpj: '',
      empresa: '',
      especialidade: '',
      observacoes: '',
      especialidades: [],
      disponibilidade: {}
    };
    
    this.especialidadesAdicionais.forEach(esp => esp.selecionado = false);
    this.activeTab = 'pessoal';
  }
}