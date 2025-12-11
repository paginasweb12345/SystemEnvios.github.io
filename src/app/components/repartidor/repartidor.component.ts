import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvioService } from '../../services/envio.service';
import { AuthService } from '../../services/auth.service';
import { Envio, EstadoEnvio } from '../../models/models';

@Component({
  selector: 'app-repartidor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="repartidor-container">
      <header class="page-header">
        <h1>Mis Entregas</h1>
        <p>Gestiona tus envíos asignados</p>
      </header>

      <div *ngIf="envios.length === 0" class="empty-state">
        <p>No tienes entregas asignadas</p>
      </div>

      <div *ngIf="envios.length > 0" class="envios-list">
        <div *ngFor="let envio of envios; trackBy: trackByEnvioId"
             class="envio-card" [class]="'estado-' + envio.estado">

          <div class="envio-header">
            <div>
              <h3>{{ envio.destinatario }}</h3>
              <p class="direccion">{{ envio.direccion }}</p>
            </div>
            <span class="costo">S/. {{ envio.costo }}</span>
          </div>

          <div class="envio-info">
            <p><strong>Fecha:</strong> {{ envio.fecha_envio | date:'dd/MM/yyyy' }}</p>
            <p *ngIf="envio.telefono"><strong>Teléfono:</strong> {{ envio.telefono }}</p>
            <p *ngIf="envio.descripcion"><strong>Descripción:</strong> {{ envio.descripcion }}</p>
          </div>

          <div class="envio-actions">
            <span class="estado-actual">{{ getEstadoLabel(envio.estado) }}</span>
            <select [value]="envio.estado"
                    (change)="actualizarEstado(envio.id!, $event)"
                    class="estado-select">
              <option value="pendiente">Pendiente</option>
              <option value="en_transito">En Tránsito</option>
              <option value="entregado">Entregado</option>
              <option value="devuelto">Devuelto</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .repartidor-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 0 20px;
      padding-bottom: 80px;
    }

    .page-header {
      margin-bottom: 40px;
      text-align: center;
    }

    .page-header h1 {
      margin: 0 0 10px 0;
      color: var(--text-main);
      font-size: 2rem;
      font-weight: 800;
    }

    .page-header p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: var(--surface-color);
      border-radius: var(--radius-xl);
      color: var(--text-secondary);
      font-size: 1.1rem;
      border: 1px dashed var(--border-color);
    }

    .envios-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 25px;
    }

    .envio-card {
      background: var(--surface-color);
      border-radius: var(--radius-xl);
      padding: 25px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .envio-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }

    /* Bordes de color según estado */
    .estado-pendiente { border-left: 5px solid var(--warning-color); }
    .estado-en_transito { border-left: 5px solid var(--info-color); }
    .estado-entregado { border-left: 5px solid var(--success-color); }
    .estado-devuelto { border-left: 5px solid var(--danger-color); }

    .envio-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-color);
    }

    .envio-header h3 {
      margin: 0 0 5px 0;
      color: var(--text-main);
      font-size: 1.25rem;
      font-weight: 700;
    }

    .direccion {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin: 0;
    }

    .costo {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-color);
      background: #eef2ff;
      padding: 6px 14px;
      border-radius: 99px;
    }

    .envio-info {
      margin-bottom: 25px;
      flex-grow: 1;
    }

    .envio-info p {
      margin: 8px 0;
      color: var(--text-main);
      font-size: 1rem;
    }

    .envio-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 1px solid var(--border-color);
      gap: 20px;
    }

    .estado-actual {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .estado-select {
      flex-grow: 1;
      padding: 10px 15px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      font-size: 0.95rem;
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.2s;
      background: var(--bg-color);
    }

    .estado-select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); /* Indigo glow */
      background: white;
    }

    @media (max-width: 768px) {
      .repartidor-container {
        padding: 0 15px;
        padding-bottom: 80px;
      }

      .envio-header {
        flex-direction: column;
        gap: 15px;
      }

      .costo {
        align-self: flex-start;
      }

      .envio-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .estado-select {
        width: 100%;
      }
    }
  `]
})
export class RepartidorComponent implements OnInit {
  envios: Envio[] = [];

  constructor(
    private envioService: EnvioService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user?.uid) {
        this.envioService.obtenerEnviosRepartidor(user.uid).subscribe({
          next: envios => {
            this.envios = envios;
            console.log('Envíos cargados para repartidor:', this.envios);
          },
          error: err => console.error('Error cargando envíos:', err)
        });
      }
    });
  }

  getEstadoLabel(estado: EstadoEnvio): string {
    const labels = {
      pendiente: '⏳ Pendiente',
      en_transito: '🚚 En Tránsito',
      entregado: '✅ Entregado',
      devuelto: '↩️ Devuelto'
    };
    return labels[estado];
  }

  async actualizarEstado(envioId: string, event: any) {
    const nuevoEstado = event.target.value as EstadoEnvio;
    try {
      await this.envioService.actualizarEstado(envioId, nuevoEstado);
    } catch (error) {
      console.error(error);
    }
  }

  trackByEnvioId(index: number, envio: Envio) {
    return envio.id;
  }
}
