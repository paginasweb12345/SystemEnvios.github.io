import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="not-found-container">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <a routerLink="/" class="btn">Volver al Inicio</a>
    </div>
  `,
    styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      background-color: #f4f4f4;
    }
    h1 {
      font-size: 6rem;
      color: #333;
      margin: 0;
    }
    p {
      font-size: 1.5rem;
      color: #666;
      margin-bottom: 2rem;
    }
    .btn {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    .btn:hover {
      background-color: #0056b3;
    }
  `]
})
export class NotFoundComponent { }
