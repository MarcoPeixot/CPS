import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/components/login.component';
import { TelaAcessorComponent } from './features/tela-acessor/components/tela-acessor.component';
import { PerfilAlunoComponent } from './features/perfil-aluno/components/perfil-aluno.component';
import { VisualizarProfissionalComponent } from './features/cadastro-profissional/components/visualizar-profissional.component';
import { HomeComponent } from './features/home/components/home.component'; 
import { MainProfissionalComponent } from './features/main-profissional/component/main-profissional.component';
import { MatchComponent } from './features/match/component/match.component';
import { MainAlunoComponent } from './features/main-aluno/component/main-aluno.component';
import { VisualizacaoMatchComponent } from './features/visualizacao-match/component/visualizacao-match.component';
import { DashComponent } from './features/dashboard/dashboard.component';
import { InstitutionsComponent } from './components/institutions/institutions.component';
import { authGuard } from './core/guard/auth.guard';
import { CallbackComponent } from './features/callback/callback.component';
import { PerfilProfissionalComponent } from './features/perfil-profissional/components/perfil-profissional.component';

export const routes: Routes = [
    // Rotas Públicas
    { path: '', component: LoginComponent },
  
    // Rotas do Aluno (protegidas)
    { path: 'perfil-aluno/:id', component: PerfilAlunoComponent, canActivate: [authGuard] },
    { path: 'aluno-list', component: MainAlunoComponent, canActivate: [authGuard] },
  
    { path: 'cadastro-profissional', component: VisualizarProfissionalComponent, canActivate: [authGuard] },
    // Rotas do Profissional (protegidas)
    { path: 'perfil-profissional/:id', component:  PerfilProfissionalComponent, canActivate: [authGuard] },
    { path: 'profissional-list', component: MainProfissionalComponent, canActivate: [authGuard] },
  
    // Match e Visualização de Matches (protegidas)
    { path: 'match/:id', component: MatchComponent, canActivate: [authGuard] }, // Para novo atendimento
    { path: 'visualizacao-match/:alunoId/:profissionalId', component: VisualizacaoMatchComponent, canActivate: [authGuard] }, // Para visualizar
    // Outras Páginas
    { path: 'home', component: HomeComponent },
    { path: 'tela1', component: TelaAcessorComponent },
    { path: 'dashboard', component: DashComponent },

    //instituições
    { path: 'instituitions', component: InstitutionsComponent },
  
    // Outras Páginas (protegidas)
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'tela1', component: TelaAcessorComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: DashComponent, canActivate: [authGuard] },
  
    // Rota para páginas não encontradas
    { path: '**', redirectTo: '' },
    { path: 'callback', component: CallbackComponent },
];