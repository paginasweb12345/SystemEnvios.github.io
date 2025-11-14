import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasService } from '../../services/estadisticas.service';
import { EnvioService } from '../../services/envio.service';
import { Estadisticas, Envio } from '../../models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <header class="page-header">
        <h1>📊 Panel de Administración</h1>
        <p>Estadísticas y métricas del sistema</p>
      </header>

      @if (estadisticas) {
        <!-- Tarjetas de Resumen -->
        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <h3>{{ estadisticas.totalEnvios }}</h3>
              <p>Total Envíos</p>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>{{ estadisticas.entregados }}</h3>
              <p>Entregados</p>
            </div>
          </div>

          <div class="stat-card progress">
            <div class="stat-icon">🚚</div>
            <div class="stat-info">
              <h3>{{ estadisticas.enTransito }}</h3>
              <p>En Tránsito</p>
            </div>
          </div>

          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <h3>{{ estadisticas.pendientes }}</h3>
              <p>Pendientes</p>
            </div>
          </div>
        </div>

        <!-- Porcentaje de Cumplimiento -->
        <div class="cumplimiento-card">
          <h2>📈 Porcentaje de Cumplimiento</h2>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="estadisticas.porcentajeCumplimiento">
              {{ estadisticas.porcentajeCumplimiento }}%
            </div>
          </div>
        </div>

        <!-- Envíos por Día -->
        <div class="chart-card">
          <h2>📅 Envíos de los Últimos 7 Días</h2>
          <div class="bar-chart">
            @for (dia of estadisticas.enviosPorDia; track dia.fecha) {
              <div class="bar-item">
                <div class="bar" [style.height.%]="getBarHeight(dia.cantidad)">
                  <span class="bar-value">{{ dia.cantidad }}</span>
                </div>
                <span class="bar-label">{{ formatFecha(dia.fecha) }}</span>
              </div>
            }
          </div>
        </div>
      }

      <!-- Lista de Todos los Envíos -->
      <div class="envios-section">
        <h2>📦 Todos los Envíos</h2>
        @if (envios.length === 0) {
          <p class="empty">No hay envíos registrados</p>
        } @else {
          <div class="table-responsive">
            <table class="envios-table">
              <thead>
                <tr>
                  <th>Destinatario</th>
                  <th>Dirección</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Costo</th>
                </tr>
              </thead>
              <tbody>
                @for (envio of envios; track envio.id) {
                  <tr>
                    <td>{{ envio.destinatario }}</td>
                    <td>{{ envio.direccion }}</td>
                    <td>{{ envio.fecha_envio | date:'dd/MM/yyyy' }}</td>
                    <td>
                      <span class="badge" [class]="'badge-' + envio.estado">
                        {{ getEstadoLabel(envio.estado) }}
                      </span>
                    </td>
                    <td class="costo">S/. {{ envio.costo }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
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
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .stat-icon {
      font-size: 3rem;
    }
    .stat-info h3 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
    }
    .stat-info p {
      margin: 5px 0 0 0;
      color: #718096;
      font-size: 1rem;
    }
    .stat-card.total .stat-info h3 { color: #667eea; }
    .stat-card.success .stat-info h3 { color: #10b981; }
    .stat-card.progress .stat-info h3 { color: #3b82f6; }
    .stat-card.pending .stat-info h3 { color: #f59e0b; }
    
    .cumplimiento-card, .chart-card, .envios-section {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .cumplimiento-card h2, .chart-card h2, .envios-section h2 {
      margin: 0 0 20px 0;
      color: #2d3748;
      font-size: 1.5rem;
    }
    .progress-bar {
      width: 100%;
      height: 50px;
      background: #e2e8f0;
      border-radius: 25px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.2rem;
      transition: width 1s ease;
    }
    .bar-chart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 250px;
      gap: 15px;
    }
    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .bar {
      width: 100%;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px 8px 0 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 10px;
      min-height: 40px;
      position: relative;
      transition: all 0.3s ease;
    }
    .bar:hover {
      opacity: 0.8;
      transform: scaleY(1.05);
    }
    .bar-value {
      color: white;
      font-weight: 700;
      font-size: 1.1rem;
    }
    .bar-label {
      margin-top: 10px;
      font-size: 0.85rem;
      color: #718096;
      text-align: center;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .envios-table {
      width: 100%;
      border-collapse: collapse;
    }
    .envios-table th {
      text-align: left;
      padding: 15px;
      background: #f7fafc;
      color: #4a5568;
      font-weight: 600;
      border-bottom: 2px solid #e2e8f0;
    }
    .envios-table td {
      padding: 15px;
      border-bottom: 1px solid #e2e8f0;
      color: #2d3748;
    }
    .envios-table tr:hover {
      background: #f7fafc;
    }
    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .badge-pendiente {
      background: #fef3c7;
      color: #92400e;
    }
    .badge-en_transito {
      background: #dbeafe;
      color: #1e3a8a;
    }
    .badge-entregado {
      background: #d1fae5;
      color: #065f46;
    }
    .badge-devuelto {
      background: #fee2e2;
      color: #991b1b;
    }
    .costo {
      font-weight: 700;
      color: #667eea;
    }
    .empty {
      text-align: center;
      color: #718096;
      padding: 40px;
    }
  `]
})
export class AdminComponent implements OnInit {
  estadisticas: Estadisticas | null = null;
  envios: Envio[] = [];

  constructor(
    private estadisticasService: EstadisticasService,
    private envioService: EnvioService
  ) {}

  ngOnInit() {
    this.estadisticasService.obtenerEstadisticas().subscribe(stats => {
      this.estadisticas = stats;
    });

    this.envioService.obtenerTodosEnvios().subscribe(envios => {
      this.envios = envios;
    });
  }

  getBarHeight(cantidad: number): number {
    if (!this.estadisticas) return 0;
    const max = Math.max(...this.estadisticas.enviosPorDia.map(d => d.cantidad));
    return max > 0 ? (cantidad / max) * 100 : 0;
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[date.getDay()];
  }

  getEstadoLabel(estado: string): string {
    const labels: any = {
      pendiente: 'Pendiente',
      en_transito: 'En Tránsito',
      entregado: 'Entregado',
      devuelto: 'Devuelto'
    };
    return labels[estado] || estado;
  }
}
