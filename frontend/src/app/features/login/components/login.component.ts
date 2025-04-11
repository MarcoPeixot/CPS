import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Router, RouterModule } from '@angular/router'; // Adicione RouterModule aqui
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Adicione RouterModule aqui
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Verificar se o usuário já está autenticado
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/home']);
      }
    });
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  handleSignUp(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/home',
      },
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }
}