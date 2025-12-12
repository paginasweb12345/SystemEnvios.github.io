import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-predicciones',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './predicciones.component.html',
    styleUrls: ['./predicciones.component.css']
})
export class PrediccionesComponent implements OnInit {
    cargando: boolean = true;

    stats = {
        totalEnvios: 0,
        porcentajeCumplimiento: 0,
        entregados: 0,
        enTransito: 0,
        pendientes: 0,
        devueltos: 0
    };

    promedioPorDia: number = 0;
    prediccionManana: number = 0;
    diaPico: { fecha: string; cantidad: number } | null = null;
    tiempoPromedioEntrega: number = 0;
    porcentajeDevoluciones: number = 0;

    destinosFrecuentes: Array<{ destino: string; cantidad: number }> = [];
    costosClasificados: Array<{ rango: string; cantidad: number }> = [];

    constructor() { }

    ngOnInit() {
        this.cargarDatos();
    }

    cargarDatos() {
        // Simulación de carga de datos
        setTimeout(() => {
            this.stats = {
                totalEnvios: 150,
                porcentajeCumplimiento: 95,
                entregados: 120,
                enTransito: 20,
                pendientes: 8,
                devueltos: 2
            };

            this.promedioPorDia = 12;
            this.prediccionManana = 15;

            this.diaPico = {
                fecha: '2023-11-24',
                cantidad: 25
            };

            this.tiempoPromedioEntrega = 2.5;
            this.porcentajeDevoluciones = 1.3;

            this.destinosFrecuentes = [
                { destino: 'Madrid', cantidad: 45 },
                { destino: 'Barcelona', cantidad: 30 },
                { destino: 'Valencia', cantidad: 15 }
            ];

            this.costosClasificados = [
                { rango: 'Bajo (< 1kg)', cantidad: 50 },
                { rango: 'Medio (1-5kg)', cantidad: 70 },
                { rango: 'Alto (> 5kg)', cantidad: 30 }
            ];

            this.cargando = false;
        }, 1500);
    }
}
