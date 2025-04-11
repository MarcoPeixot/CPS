import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeTab = 'profissionais'; // Default active tab
  currentUrl = '';
  
  imgSrc = 'assets/logoCpsy.png';

  constructor(private router: Router, public auth: AuthService) {
    // Monitora mudanças de URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  isLoginPage(): boolean {
    // Retorna true se estiver na rota raiz (login) ou na rota explícita de login
    return this.currentUrl === '/' || this.currentUrl === '/login';
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
  }
}