import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // Import RouterLink
import { EnvioService } from '../../services/envio.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Envio, EstadoEnvio, Usuario } from '../../models/models';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, RouterLink], // Add RouterLink
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  envios: Envio[] = [];
  enviosFiltrados: Envio[] = [];
  filtroActual: 'todos' | EstadoEnvio = 'todos';
  repartidores: Usuario[] = [];

  searchText = '';
  loading = true; // Loading state

  constructor(
    private envioService: EnvioService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    // Obtener envíos del cliente
    this.envioService.obtenerEnviosCliente(user.uid).subscribe({
      next: (envios) => {
        this.envios = envios;
        this.filtrar(this.filtroActual);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener envíos:', error);
        this.loading = false;
      }
    });

    // Obtener repartidores
    this.usuarioService.obtenerRepartidores().subscribe({
      next: (repartidores) => {
        console.log('Repartidores disponibles:', repartidores);
        this.repartidores = repartidores;
      },
      error: (error) => console.error('Error al obtener repartidores:', error)
    });
  }

  filtrar(estado: 'todos' | EstadoEnvio) {
    this.filtroActual = estado;
    this.enviosFiltrados = estado === 'todos'
      ? this.envios
      : this.envios.filter(e => e.estado === estado);
  }

  getEstadoLabel(estado: EstadoEnvio): string {
    const labels = {
      pendiente: 'Pendiente',
      en_transito: 'En Tránsito',
      entregado: 'Entregado',
      devuelto: 'Devuelto'
    };
    return labels[estado];
  }

  async asignarRepartidor(envio: Envio) {
    if (this.repartidores.length === 0) {
      alert('No hay repartidores disponibles. Registra un repartidor primero.');
      return;
    }

    // Si solo hay un repartidor
    if (this.repartidores.length === 1) {
      const rep = this.repartidores[0];
      const confirmar = confirm(`¿Enviar este paquete con el repartidor ${rep.nombre}?`);

      if (confirmar) {
        try {
          await this.envioService.asignarRepartidor(envio.id!, rep.uid);
          alert('Envío asignado exitosamente al repartidor ' + rep.nombre);
        } catch (error) {
          console.error('Error:', error);
          alert('Error al asignar repartidor');
        }
      }

      return;
    }

    // Si hay varios repartidores
    let opciones = 'Selecciona un repartidor:\n\n';
    this.repartidores.forEach((rep, index) => {
      opciones += `${index + 1}. ${rep.nombre}\n`;
    });

    const seleccion = prompt(opciones + '\nIngresa el número:');
    if (!seleccion) return;

    const index = parseInt(seleccion) - 1;
    if (index < 0 || index >= this.repartidores.length) return;

    try {
      const rep = this.repartidores[index];
      await this.envioService.asignarRepartidor(envio.id!, rep.uid);
      alert('Envío asignado exitosamente al repartidor ' + rep.nombre);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al asignar repartidor');
    }
  }

  verDetalle(envio: Envio) {
    const repartidor = envio.repartidorId
      ? this.repartidores.find(r => r.uid === envio.repartidorId)?.nombre || 'Sin asignar'
      : 'Sin asignar';

    alert(`
      Detalle del Envío

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
