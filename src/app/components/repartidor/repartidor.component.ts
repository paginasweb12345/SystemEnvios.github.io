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
        <h1> Mis Entregas</h1>
        <p>Gestiona tus envíos asignados</p>
      </header>

      @if (envios.length === 0) {
        <div class="empty-state">
          <p> No tienes entregas asignadas</p>
        </div>
      } @else {
        <div class="envios-list">
          @for (envio of envios; track envio.id) {
            <div class="envio-card" [class]="'estado-' + envio.estado">
              <div class="envio-header">
                <div>
                  <h3>{{ envio.destinatario }}</h3>
                  <p class="direccion">{{ envio.direccion }}</p>
                </div>
                <span class="costo">S/. {{ envio.costo }}</span>
              </div>

              <div class="envio-info">
                <p><strong>Fecha:</strong> {{ envio.fecha_envio | date:'dd/MM/yyyy' }}</p>
                @if (envio.telefono) {
                  <p><strong>Teléfono:</strong> {{ envio.telefono }}</p>
                }
                @if (envio.descripcion) {
                  <p><strong>Descripción:</strong> {{ envio.descripcion }}</p>
                }
              </div>

              <div class="envio-actions">
                <span class="estado-actual">{{ getEstadoLabel(envio.estado) }}</span>
                <select
                  [value]="envio.estado"
                  (change)="actualizarEstado(envio.id!, $event)"
                  class="estado-select"
                >
                  <option value="pendiente"> Pendiente</option>
                  <option value="en_transito"> En Tránsito</option>
                  <option value="entregado"> Entregado</option>
                  <option value="devuelto"> Devuelto</option>
                </select>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .repartidor-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .page-header h1 {
      margin: 0 0 10px 0;
      color: #2d3748;
      font-size: 2rem;
    }
    .page-header p {
      margin: 0 0 30px 0;
      color: #718096;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      color: #718096;
    }
    .envios-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .envio-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 5px solid #cbd5e0;
    }
    .envio-card.estado-en_transito {
      border-left-color: #3b82f6;
    }
    .envio-card.estado-entregado {
      border-left-color: #10b981;
    }
    .envio-card.estado-devuelto {
      border-left-color: #ef4444;
    }
    .envio-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .envio-header h3 {
      margin: 0 0 8px 0;
      color: #2d3748;
      font-size: 1.3rem;
    }
    .direccion {
      color: #718096;
      margin: 0;
    }
    .costo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
    }
    .envio-info {
      margin: 15px 0;
      padding: 15px 0;
      border-top: 2px solid #f7fafc;
      border-bottom: 2px solid #f7fafc;
    }
    .envio-info p {
      margin: 8px 0;
      color: #4a5568;
    }
    .envio-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }
    .estado-actual {
      font-weight: 600;
      color: #4a5568;
    }
    .estado-select {
      padding: 8px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      background: white;
    }
    .estado-select:focus {
      outline: none;
      border-color: #667eea;
    }
  `]
})
export class RepartidorComponent implements OnInit {
  envios: Envio[] = [];

  constructor(
    private envioService: EnvioService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.envioService.obtenerEnviosRepartidor(user.uid).subscribe(envios => {
        this.envios = envios;
      });
    }
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
      alert('✅ Estado actualizado correctamente');
    } catch (error) {
      alert('❌ Error al actualizar el estado');
      console.error(error);
    }
  }

}
