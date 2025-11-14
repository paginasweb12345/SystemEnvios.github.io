import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EnvioService } from '../../services/envio.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Envio, EstadoEnvio, Usuario } from '../../models/models';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  envios: Envio[] = [];
  enviosFiltrados: Envio[] = [];
  filtroActual: 'todos' | EstadoEnvio = 'todos';
  repartidores: Usuario[] = [];

  constructor(
    private envioService: EnvioService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      // Obtener envíos del cliente
      this.envioService.obtenerEnviosCliente(user.uid).subscribe({
        next: (envios) => {
          this.envios = envios;
          this.filtrar(this.filtroActual);
        },
        error: (error) => {
          console.error('❌ Error al obtener envíos:', error);
        }
      });

      // Obtener repartidores disponibles
      this.usuarioService.obtenerRepartidores().subscribe({
        next: (repartidores) => {
          console.log('🚚 Repartidores disponibles:', repartidores);
          this.repartidores = repartidores;
        },
        error: (error) => {
          console.error('❌ Error al obtener repartidores:', error);
        }
      });
    }
  }

  filtrar(estado: 'todos' | EstadoEnvio) {
    this.filtroActual = estado;
    if (estado === 'todos') {
      this.enviosFiltrados = this.envios;
    } else {
      this.enviosFiltrados = this.envios.filter(e => e.estado === estado);
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

  async asignarRepartidor(envio: Envio) {
    if (this.repartidores.length === 0) {
      alert('❌ No hay repartidores disponibles. Registra un repartidor primero.');
      return;
    }

    // Si solo hay un repartidor, asignarlo directamente
    if (this.repartidores.length === 1) {
      const confirmar = confirm(`¿Enviar este paquete con el repartidor ${this.repartidores[0].nombre}?`);
      if (confirmar) {
        try {
          await this.envioService.asignarRepartidor(envio.id!, this.repartidores[0].uid);
          alert('✅ Envío asignado exitosamente al repartidor ' + this.repartidores[0].nombre);
        } catch (error) {
          console.error('Error:', error);
          alert('❌ Error al asignar repartidor');
        }
      }
    } else {
      // Si hay varios, mostrar opciones
      let opciones = 'Selecciona un repartidor:\n\n';
      this.repartidores.forEach((rep, index) => {
        opciones += `${index + 1}. ${rep.nombre}\n`;
      });

      const seleccion = prompt(opciones + '\nIngresa el número:');
      if (seleccion) {
        const index = parseInt(seleccion) - 1;
        if (index >= 0 && index < this.repartidores.length) {
          try {
            await this.envioService.asignarRepartidor(envio.id!, this.repartidores[index].uid);
            alert('✅ Envío asignado exitosamente al repartidor ' + this.repartidores[index].nombre);
          } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al asignar repartidor');
          }
        }
      }
    }
  }

  verDetalle(envio: Envio) {
    const repartidor = envio.repartidorId 
      ? this.repartidores.find(r => r.uid === envio.repartidorId)?.nombre || 'Sin asignar'
      : 'Sin asignar';

    alert(`
      📦 Detalle del Envío
      
      Destinatario: ${envio.destinatario}
      Dirección: ${envio.direccion}
      Estado: ${this.getEstadoLabel(envio.estado)}
      Repartidor: ${repartidor}
      Costo: S/. ${envio.costo}
      Fecha: ${new Date(envio.fecha_envio).toLocaleDateString()}
      ${envio.descripcion ? '\nDescripción: ' + envio.descripcion : ''}
    `);
  }
}