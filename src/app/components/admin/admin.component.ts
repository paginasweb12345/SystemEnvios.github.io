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

      <!-- HEADER -->
      <header class="page-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona envíos, estadísticas y métricas del sistema</p>

        <div class="vista-selector">
          <button (click)="mostrarVista='estadisticas'" [class.active]="mostrarVista==='estadisticas'">📊 Panel Admin</button>
          <button (click)="mostrarVista='envios'" [class.active]="mostrarVista==='envios'">📦 Todos los Envíos</button>
        </div>
      </header>

      <!-- DASHBOARD ESTADÍSTICAS -->
      <section *ngIf="mostrarVista==='estadisticas' && estadisticas" class="dashboard">
        <div class="cards-grid">
          <div class="card total">
            <div class="card-icon"></div>
            <div class="card-content">
              <h3>{{ estadisticas.totalEnvios }}</h3>
              <p>Total Envíos</p>
            </div>
          </div>
          <div class="card success">
            <div class="card-icon"></div>
            <div class="card-content">
              <h3>{{ estadisticas.entregados }}</h3>
              <p>Entregados</p>
            </div>
          </div>
          <div class="card transit">
            <div class="card-icon"></div>
            <div class="card-content">
              <h3>{{ estadisticas.enTransito }}</h3>
              <p>En Tránsito</p>
            </div>
          </div>
          <div class="card pending">
            <div class="card-icon">⏳</div>
            <div class="card-content">
              <h3>{{ estadisticas.pendientes }}</h3>
              <p>Pendientes</p>
            </div>
          </div>
          <div class="card asignados">
            <div class="card-icon"></div>
            <div class="card-content">
              <h3>{{ estadisticas.enviosAsignados }}</h3>
              <p>Asignados</p>
            </div>
          </div>
          <div class="card sin-asignar">
            <div class="card-icon"></div>
            <div class="card-content">
              <h3>{{ estadisticas.enviosSinAsignar }}</h3>
              <p>Sin Asignar</p>
            </div>
          </div>
        </div>

        <div class="charts">
          <div class="chart-bar">
            <h2> Envíos últimos 7 días</h2>
            <div class="bar-chart">
              <div *ngFor="let dia of estadisticas.enviosPorDia; trackBy: trackByFecha" class="bar-item">
                <div class="bar" [style.height.%]="getBarHeight(dia.cantidad)">
                  <span class="bar-value">{{ dia.cantidad }}</span>
                </div>
                <span class="bar-label">{{ formatFecha(dia.fecha) }}</span>
              </div>
            </div>
          </div>

          <div class="chart-progress">
            <h2>Porcentaje de Cumplimiento</h2>
            <div class="progress-container">
              <div class="progress-fill" [style.width.%]="estadisticas.porcentajeCumplimiento">
                {{ estadisticas.porcentajeCumplimiento }}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DASHBOARD ENVÍOS -->
      <section *ngIf="mostrarVista==='envios'" class="envios-section">
        <h2> Lista de Envíos</h2>
        <div *ngIf="envios.length===0" class="empty">No hay envíos registrados</div>
        <div *ngIf="envios.length>0" class="table-responsive">
          <table class="envios-table">
            <thead>
              <tr>
                <th (click)="ordenarPor('destinatario')" style="cursor: pointer;">Destinatario {{ getSortIcon('destinatario') }}</th>
                <th>Dirección</th>
                <th (click)="ordenarPor('fecha_envio')" style="cursor: pointer;">Fecha {{ getSortIcon('fecha_envio') }}</th>
                <th (click)="ordenarPor('estado')" style="cursor: pointer;">Estado {{ getSortIcon('estado') }}</th>
                <th>Repartidor</th>
                <th (click)="ordenarPor('costo')" style="cursor: pointer;">Costo {{ getSortIcon('costo') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let envio of envios; trackBy: trackById">
                <td>{{ envio.destinatario }}</td>
                <td>{{ envio.direccion }}</td>
                <td>{{ envio.fecha_envio | date:'dd/MM/yyyy' }}</td>
                <td><span class="badge" [class]="'badge-' + envio.estado">{{ getEstadoLabel(envio.estado) }}</span></td>
                <td>{{ envio.repartidorId ? 'Asignado' : 'Sin asignar' }}</td>
                <td class="costo">S/. {{ envio.costo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .admin-container { max-width: 1400px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px; }
    .page-header h1 { font-size: 2rem; color: #2d3748; margin-bottom: 5px; }
    .page-header p { color: #718096; margin-bottom: 15px; }
    .vista-selector { margin-top: 10px; }
    .vista-selector button { margin-right: 10px; padding: 8px 18px; border-radius: 6px; border: 1px solid #667eea; background: #fff; cursor: pointer; transition: 0.3s; }
    .vista-selector button.active { background: #667eea; color: #fff; }

    .cards-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; margin-bottom:30px; }
    .card { display:flex; align-items:center; padding:20px; border-radius:10px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
    .card-icon { font-size:2.5rem; margin-right:15px; }
    .card-content h3 { margin:0; font-size:1.8rem; }
    .card-content p { margin:3px 0 0 0; color:#718096; }
    .card.total .card-content h3 { color:#667eea; }
    .card.success .card-content h3 { color:#10b981; }
    .card.transit .card-content h3 { color:#3b82f6; }
    .card.pending .card-content h3 { color:#f59e0b; }
    .card.asignados .card-content h3 { color:#0ea5e9; }
    .card.sin-asignar .card-content h3 { color:#f43f5e; }

    .charts { display:flex; flex-wrap:wrap; gap:20px; margin-bottom:30px; }
    .chart-bar, .chart-progress { flex:1; min-width:300px; background:#fff; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
    .bar-chart { display:flex; align-items:flex-end; justify-content:space-between; height:200px; gap:10px; }
    .bar-item { flex:1; display:flex; flex-direction:column; align-items:center; }
    .bar { width:100%; background:#667eea; border-radius:6px 6px 0 0; display:flex; align-items:flex-start; justify-content:center; padding-top:5px; transition:0.3s; }
    .bar-value { color:#fff; font-weight:700; font-size:0.9rem; }
    .bar-label { margin-top:5px; font-size:0.75rem; color:#718096; }
    .progress-container { width:100%; height:30px; background:#e2e8f0; border-radius:15px; overflow:hidden; margin-top:10px; }
    .progress-fill { height:100%; background:linear-gradient(90deg,#10b981 0%,#059669 100%); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1rem; transition:0.5s; }

    .table-responsive { overflow-x:auto; margin-top:20px; }
    .envios-table { width:100%; border-collapse: collapse; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
    .envios-table th, .envios-table td { padding:12px 15px; text-align:left; }
    .envios-table th { background:#f1f5f9; color:#2d3748; font-weight:600; }
    .envios-table tr:hover { background:#f7fafc; }
    .badge { padding:4px 10px; border-radius:12px; font-size:0.8rem; font-weight:600; }
    .badge-pendiente { background:#fef3c7; color:#92400e; }
    .badge-en_transito { background:#dbeafe; color:#1e3a8a; }
    .badge-entregado { background:#d1fae5; color:#065f46; }
    .badge-devuelto { background:#fee2e2; color:#991b1b; }
    .costo { font-weight:700; color:#667eea; }
    .empty { text-align:center; color:#718096; padding:30px; font-size:1rem; }
  `]
})
export class AdminComponent implements OnInit {
  mostrarVista: 'estadisticas' | 'envios' = 'estadisticas';
  estadisticas: Estadisticas & { enviosAsignados?: number; enviosSinAsignar?: number } | null = null;
  envios: Envio[] = [];
  sortField: string = 'fecha_envio';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private estadisticasService: EstadisticasService,
    private envioService: EnvioService
  ) { }

  ngOnInit() {
    this.estadisticasService.obtenerEstadisticas().subscribe(stats => {
      const asignados = stats.totalEnvios - stats.pendientes;
      const sinAsignar = stats.pendientes;
      this.estadisticas = { ...stats, enviosAsignados: asignados, enviosSinAsignar: sinAsignar };
    });

    this.envioService.obtenerTodosEnvios().subscribe(envios => {
      this.envios = envios.map(e => ({
        ...e,
        fecha_envio: (e.fecha_envio as any)?.toDate?.() || new Date(e.fecha_envio)
      }));
      this.triageEnvios();
    });
  }

  getBarHeight(cantidad: number): number {
    if (!this.estadisticas) return 0;
    const max = Math.max(...this.estadisticas.enviosPorDia.map(d => d.cantidad));
    return max > 0 ? (cantidad / max) * 100 : 0;
  }

  formatFecha(fecha: string | Date): string {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
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

  ordenarPor(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.triageEnvios();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  triageEnvios() {
    this.envios.sort((a: any, b: any) => {
      let valA = a[this.sortField];
      let valB = b[this.sortField];

      if (this.sortField === 'fecha_envio') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  trackByFecha(index: number, item: any) { return item.fecha; }
  trackById(index: number, item: Envio) { return item.id; }
}
