import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvioService } from '../services/envio.service';
import { Envio, Estadisticas } from '../models/models';

@Component({
  selector: 'app-predicciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './predicciones.component.html',
  styleUrls: ['./predicciones.component.css']
})
export class PrediccionesComponent implements OnInit {

  envios: Envio[] = [];
  stats!: Estadisticas;
  cargando = true;

  promedioPorDia = 0;
  diaPico: { fecha: string, cantidad: number } | null = null;
  prediccionManana = 0;
  tiempoPromedioEntrega = 0;
  porcentajeDevoluciones = 0;
  destinosFrecuentes: { destino: string, cantidad: number }[] = [];
  costosClasificados: { rango: string, cantidad: number }[] = [];

  constructor(private envioService: EnvioService) {}

  ngOnInit(): void {
    this.envioService.obtenerTodosEnvios().subscribe(envios => {
      this.envios = envios;
      this.calcularEstadisticas();
      this.calculosAvanzados();
      this.cargando = false;
    });
  }

  //  CONVERSIÓN SEGURA DE FECHA
  private convertirFecha(fecha: any): Date | null {
    if (!fecha) return null;

    // Firestore Timestamp
    if (fecha.toDate) {
      return fecha.toDate();
    }

    // String
    if (typeof fecha === "string") {
      const d = new Date(fecha);
      return isNaN(d.getTime()) ? null : d;
    }

    // Date
    if (fecha instanceof Date) {
      return fecha;
    }

    return null;
  }


  calcularEstadisticas() {
    const total = this.envios.length;

    const entregados = this.envios.filter(e => e.estado === 'entregado').length;
    const enTransito = this.envios.filter(e => e.estado === 'en_transito').length;
    const pendientes = this.envios.filter(e => e.estado === 'pendiente').length;
    const devueltos = this.envios.filter(e => e.estado === 'devuelto').length;

    const cumplimiento = total > 0 ? (entregados / total) * 100 : 0;

    // Agrupar por día
    const enviosPorDia: { fecha: string; cantidad: number }[] = [];
    const mapa = new Map<string, number>();

    this.envios.forEach(envio => {
      const fechaObj = this.convertirFecha(envio.fecha_envio);
      if (!fechaObj) return;

      const fecha = fechaObj.toISOString().split('T')[0];
      mapa.set(fecha, (mapa.get(fecha) || 0) + 1);
    });

    mapa.forEach((cantidad, fecha) => {
      enviosPorDia.push({ fecha, cantidad });
    });

    this.stats = {
      totalEnvios: total,
      entregados,
      enTransito,
      pendientes,
      devueltos,
      porcentajeCumplimiento: Math.round(cumplimiento),
      enviosPorDia
    };
  }


  //  CÁLCULOS AVANZADOS
  calculosAvanzados() {
    if (!this.stats || this.stats.enviosPorDia.length === 0) return;

    //  Promedio por día
    const totalDias = this.stats.enviosPorDia.length;
    const totalEnvios = this.stats.totalEnvios;
    this.promedioPorDia = +(totalEnvios / totalDias).toFixed(2);

    //  Día pico
    this.diaPico = this.stats.enviosPorDia.reduce((max, dia) =>
      dia.cantidad > max.cantidad ? dia : max
    );

    //  Predicción mañana
    const tendencia = this.diaPico.cantidad > this.promedioPorDia ? 1.2 : 1.0;
    this.prediccionManana = Math.round(this.promedioPorDia * tendencia);

    //  Tiempo promedio de entrega (simulado)
    const tiempos: number[] = [];

    this.envios.forEach(e => {
      if (e.estado === 'entregado') {
        const fechaObj = this.convertirFecha(e.fecha_envio);
        if (!fechaObj) return;

        const fEnv = fechaObj.getTime();
        const fEnt = fEnv + (1000 * 60 * 60 * 24 * 2); // Simulación

        const dias = (fEnt - fEnv) / (1000 * 60 * 60 * 24);
        tiempos.push(dias);
      }
    });

    this.tiempoPromedioEntrega =
      tiempos.length > 0 ? +(tiempos.reduce((a, b) => a + b, 0) / tiempos.length).toFixed(1) : 0;

    //  Porcentaje de devoluciones
    this.porcentajeDevoluciones = this.stats.totalEnvios > 0
      ? +(this.stats.devueltos * 100 / this.stats.totalEnvios).toFixed(2)
      : 0;

    // Destinos frecuentes
    const mapaDestinos = new Map<string, number>();

    this.envios.forEach(e => {
      mapaDestinos.set(e.direccion, (mapaDestinos.get(e.direccion) || 0) + 1);
    });

    this.destinosFrecuentes = Array.from(mapaDestinos.entries())
      .map(([destino, cantidad]) => ({ destino, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    //  Clasificación por costo
    const bajo = this.envios.filter(e => e.costo <= 20).length;
    const medio = this.envios.filter(e => e.costo > 20 && e.costo <= 50).length;
    const alto = this.envios.filter(e => e.costo > 50).length;

    this.costosClasificados = [
      { rango: "0 - 20", cantidad: bajo },
      { rango: "21 - 50", cantidad: medio },
      { rango: "50+", cantidad: alto }
    ];
  }
}
