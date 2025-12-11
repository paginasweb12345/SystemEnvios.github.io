import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="not-found-container">
      <div class="content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <a routerLink="/dashboard" class="btn-home">Volver al Inicio</a>
      </div>
    </div>
  `,
    styles: [`
    .not-found-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f8fafc;
      text-align: center;
      padding: 20px;
    }
    
    .content h1 {
      font-size: 8rem;
      font-weight: 900;
      color: #6366f1;
      margin: 0;
      line-height: 1;
    }

    .content h2 {
      font-size: 2rem;
      color: #1e293b;
      margin: 20px 0 10px;
    }

    .content p {
      color: #64748b;
      margin-bottom: 40px;
      font-size: 1.1rem;
    }

    .btn-home {
      display: inline-block;
      padding: 14px 28px;
      background: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 99px;
      font-weight: 600;
      transition: all 0.2s;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
    }

    .btn-home:hover {
      background: #4338ca;
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
    }
  `]
})
export class NotFoundComponent { }
