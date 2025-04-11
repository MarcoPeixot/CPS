import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userName: string = 'Usuário';
  userInitial: string = 'U';
  userPicture: string | null = null;
  isAuthenticated: boolean = false;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    // Obter informações do usuário autenticado
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userName = user.name || user.email || 'Usuário';
        this.userInitial = this.userName.charAt(0).toUpperCase();
        this.userPicture = user.picture || null;
        this.isAuthenticated = true;
      }
    });
  }

  logout(): void {
    this.auth.logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
  }
}