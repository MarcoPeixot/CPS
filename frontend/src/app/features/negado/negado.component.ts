import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: './acesso-negado.component.html',
})
export class AcessoNegadoComponent {}