import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProfissionalService } from '../services/profissional.service';
import { EspecialidadeService } from '../services/especialidade.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

interface Profissional {
  id: number;
  nome: string;
  empresa: string;
  especialidades: string[];
  informacoes?: string;
}

interface Especialidade {
  id: number;
  nome: string;
}

interface ProfissionalEspecialidade {
  id: number;
  id_profissional: number;
  id_especialidade: number;
}

@Component({
  selector: 'app-main-profissional',
  templateUrl: './main-profissional.component.html',
  styleUrls: ['./main-profissional.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent]
})

export class MainProfissionalComponent implements OnInit {
  profissionais: Profissional[] = [];
  profissionaisFiltrados: Profissional[] = [];
  todasEspecialidades: Especialidade[] = [];
  termoPesquisa: string = '';
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 1;
  mostrarModalEspecialidade = false;
  novaEspecialidade = '';
  salvando = false;
  isInputFocused = false;

  constructor(
    private profissionalService: ProfissionalService,
    private especialidadeService: EspecialidadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarTodasEspecialidades();
    this.carregarProfissionais();
  }

  carregarTodasEspecialidades(): void {
    this.especialidadeService.listarEspecialidades().subscribe(
      (dados) => {
        this.todasEspecialidades = dados;
        console.log('Todas especialidades carregadas:', this.todasEspecialidades);
      },
      (erro) => {
        console.error('Erro ao carregar especialidades:', erro);
      }
    );
  }

  carregarProfissionais(): void {
    this.profissionalService.listarProfissionais().subscribe(
      (dados) => {
        this.profissionais = dados;
        this.profissionais.forEach(profissional => {
          this.carregarEspecialidadesParaProfissional(profissional);
        });
        this.calcularTotalPaginas();
        this.aplicarPaginacao();
      },
      (erro) => {
        console.error('Erro ao carregar profissionais:', erro);
      }
    );
  }

  carregarEspecialidadesParaProfissional(profissional: Profissional): void {
    this.especialidadeService.listarEspecialidadesPorProfissional(profissional.nome).subscribe(
      (relacoes: ProfissionalEspecialidade[]) => {
        console.log(`Relações de especialidades para ${profissional.nome}:`, relacoes);
        
        if (Array.isArray(relacoes) && relacoes.length > 0) {
          // Primeiro inicializa o array de especialidades
          profissional.especialidades = [];
          
          // Para cada relação, busca o nome da especialidade usando o ID
          const promessas = relacoes.map(relacao => {
            return new Promise<void>((resolve) => {
              // Se já temos todas as especialidades carregadas, usamos o cache
              if (this.todasEspecialidades.length > 0) {
                const especialidade = this.todasEspecialidades.find(e => e.id === relacao.id_especialidade);
                if (especialidade && especialidade.nome) {
                  profissional.especialidades.push(especialidade.nome);
                }
                resolve();
              } else {
                // Caso contrário, buscamos a especialidade individual
                this.especialidadeService.obterEspecialidade(relacao.id_especialidade).subscribe(
                  (especialidade: Especialidade) => {
                    if (especialidade && especialidade.nome) {
                      profissional.especialidades.push(especialidade.nome);
                    }
                    resolve();
                  },
                  (erro) => {
                    console.error(`Erro ao carregar especialidade ${relacao.id_especialidade}:`, erro);
                    resolve();
                  }
                );
              }
            });
          });
          
          // Quando todas as buscas terminarem, atualiza as informações
          Promise.all(promessas).then(() => {
            profissional.informacoes = profissional.especialidades.length > 0 
              ? profissional.especialidades.join(', ') 
              : 'Nenhuma especialidade';
            
            // Atualiza a lista filtrada para refletir as mudanças
            this.aplicarPaginacao();
          });
        } else {
          profissional.especialidades = [];
          profissional.informacoes = 'Nenhuma especialidade';
        }
      },
      (erro) => {
        console.error(`Erro ao carregar especialidades para ${profissional.nome}:`, erro);
        profissional.informacoes = 'Nenhuma especialidade';
      }
    );
  }

  calcularTotalPaginas(): void {
    this.totalPaginas = Math.ceil(this.profissionais.length / this.itensPorPagina);
  }

  aplicarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.profissionaisFiltrados = this.filtrarProfissionais().slice(inicio, fim);
  }

  filtrarProfissionais(): Profissional[] {
    if (!this.termoPesquisa.trim()) {
      return this.profissionais;
    }

    const termo = this.termoPesquisa.toLowerCase().trim();
    return this.profissionais.filter(profissional =>
      profissional.nome.toLowerCase().includes(termo) ||
      (profissional.empresa && profissional.empresa.toLowerCase().includes(termo)) ||
      (profissional.informacoes && profissional.informacoes.toLowerCase().includes(termo))
    );
  }

  pesquisarProfissionais(): void {
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

  visualizarProfissional(id: number): void {
    this.router.navigate(['/perfil-profissional', id]);
  }

  cadastrarProfissional(): void {
    this.router.navigate(['cadastro-profissional']);
  }

  abrirModalEspecialidade(): void {
    this.mostrarModalEspecialidade = true;
    this.novaEspecialidade = '';
  }

  fecharModalEspecialidade(): void {
    this.mostrarModalEspecialidade = false;
  }

  salvarEspecialidade(): void {
    if (!this.novaEspecialidade.trim()) return;

    this.salvando = true;
    
    this.especialidadeService.cadastrarEspecialidade(this.novaEspecialidade)
      .subscribe({
        next: (response) => {
          this.salvando = false;
          this.fecharModalEspecialidade();
          alert('Especialidade cadastrada com sucesso!');
          
          // Atualiza a lista de especialidades
          this.carregarTodasEspecialidades();
        },
        error: (err) => {
          this.salvando = false;
          console.error('Erro ao cadastrar especialidade:', err);
          alert('Erro ao cadastrar especialidade. Por favor, tente novamente.');
        }
      });
  }
}