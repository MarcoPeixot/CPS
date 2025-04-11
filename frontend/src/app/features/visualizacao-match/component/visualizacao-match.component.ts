import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfissionalService } from '../../match/services/profissional.service';

@Component({
  selector: 'app-visualizacao-match',
  templateUrl: './visualizacao-match.component.html',
  styleUrls: ['./visualizacao-match.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class VisualizacaoMatchComponent implements OnInit {
  student: any = {
    nome: 'Carregando...',
    idade: 0,
    curso: 'Carregando...',
    serie: 'Carregando...',
    turno: 'Carregando...',
    transporteEspecial: 'Carregando...'
  };

  professional: any = {
    nome: 'Carregando...',
    idade: 0,
    formacao: 'Carregando...',
    especialidade: 'Carregando...',
    turno: 'Carregando...',
    alunosAcompanhados: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profissionalService: ProfissionalService
  ) { }

  ngOnInit(): void {
    // Recuperar os IDs da rota
    this.route.paramMap.subscribe(params => {
      const alunoId = params.get('alunoId');
      const profissionalId = params.get('profissionalId');

      if (alunoId && profissionalId) {
        this.carregarInformacoesAluno(alunoId);
        this.carregarInformacoesProfissional(profissionalId);
      }
    });
  }

  carregarInformacoesAluno(alunoId: string): void {
    this.profissionalService.getAluno(alunoId).subscribe({
      next: (aluno: any) => {
        this.student = {
          nome: aluno.nome,
          idade: this.calcularIdade(aluno.data_nascimento),
          curso: aluno.curso,
          serie: aluno.serie || 'Não informado',
          turno: aluno.turno || 'Não informado',
          transporteEspecial: aluno.transporte_especial ? 
            (aluno.nome_transporte_especial || 'Sim') : 'Não'
        };
      },
      error: (err) => {
        console.error('Erro ao carregar informações do aluno:', err);
      }
    });
  }

  carregarInformacoesProfissional(profissionalId: string): void {
    this.profissionalService.getProfissional(profissionalId).subscribe({
      next: (profissional: any) => {
        this.professional = {
          nome: profissional.nome,
          idade: this.calcularIdade(profissional.data_nascimento),
          formacao: profissional.formacao || 'Não informado',
          especialidade: profissional.especialidade || 'Não informado',
          turno: profissional.turno || 'Não informado',
          alunosAcompanhados: profissional.alunos_acompanhados || 0
        };
      },
      error: (err) => {
        console.error('Erro ao carregar informações do profissional:', err);
      }
    });
  }

  calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  voltar(): void {
    this.router.navigate(['/match']);
  }

  concluido(): void {
    // Lógica para concluir o match
    this.router.navigate(['/alunos']);
  }
}