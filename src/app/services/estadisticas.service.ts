import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Firestore,
  collection,
  onSnapshot,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { Estadisticas, Envio } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private firestore: Firestore;

  constructor() {
    this.firestore = inject('FIRESTORE' as any); // ✅ CAMBIO AQUÍ
  }

  // 📊 Obtener estadísticas generales
  obtenerEstadisticas(): Observable<Estadisticas> {
    const ref = collection(this.firestore, 'envios');

    return new Observable(observer => {
      const unsubscribe = onSnapshot(ref,
        snapshot => {
          const envios = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha_envio: doc.data()['fecha_envio']?.toDate?.() || doc.data()['fecha_envio']
          })) as Envio[];

          const stats = this.calcularEstadisticas(envios);
          observer.next(stats);
        },
        error => observer.error(error)
      );
      return () => unsubscribe();
    });
  }

  // 📈 Calcular estadísticas
  private calcularEstadisticas(envios: Envio[]): Estadisticas {
    const totalEnvios = envios.length;
    const entregados = envios.filter(e => e.estado === 'entregado').length;
    const enTransito = envios.filter(e => e.estado === 'en_transito').length;
    const pendientes = envios.filter(e => e.estado === 'pendiente').length;
    const devueltos = envios.filter(e => e.estado === 'devuelto').length;

    const porcentajeCumplimiento = totalEnvios > 0
      ? Math.round((entregados / totalEnvios) * 100)
      : 0;

    // Agrupar envíos por día (últimos 7 días)
    const enviosPorDia = this.agruparPorDia(envios);

    return {
      totalEnvios,
      entregados,
      enTransito,
      pendientes,
      devueltos,
      porcentajeCumplimiento,
      enviosPorDia
    };
  }

  // 📅 Agrupar envíos por día
  private agruparPorDia(envios: Envio[]): { fecha: string; cantidad: number }[] {
    const hoy = new Date();
    const ultimos7Dias: { fecha: string; cantidad: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];

      const cantidad = envios.filter(envio => {
        const fechaEnvio = new Date(envio.fecha_envio);
        return fechaEnvio.toISOString().split('T')[0] === fechaStr;
      }).length;

      ultimos7Dias.push({
        fecha: fechaStr,
        cantidad
      });
    }

    return ultimos7Dias;
  }

  // 📊 Estadísticas por rango de fechas
  obtenerEstadisticasPorRango(fechaInicio: Date, fechaFin: Date): Observable<Estadisticas> {
    const ref = collection(this.firestore, 'envios');
    const q = query(
      ref,
      where('fecha_envio', '>=', Timestamp.fromDate(fechaInicio)),
      where('fecha_envio', '<=', Timestamp.fromDate(fechaFin))
    );

    return new Observable(observer => {
      const unsubscribe = onSnapshot(q,
        snapshot => {
          const envios = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha_envio: doc.data()['fecha_envio']?.toDate?.() || doc.data()['fecha_envio']
          })) as Envio[];

          const stats = this.calcularEstadisticas(envios);
          observer.next(stats);
        },
        error => observer.error(error)
      );
      return () => unsubscribe();
    });
  }
}