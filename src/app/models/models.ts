
export interface Usuario {
    uid: string;
    email: string;
    nombre: string;
    rol: 'cliente' | 'repartidor' | 'administrador';
    telefono?: string;
    createdAt?: string | Date | any;
}

export type EstadoEnvio = 'pendiente' | 'en_transito' | 'entregado' | 'devuelto';

export interface Envio {
    id?: string;
    userId?: string;
    repartidorId?: string;
    remitente: string;
    destinatario: string;
    direccion: string;
    telefono: string;
    fecha_envio: string | Date | any;
    costo: number;
    descripcion?: string;
    estado: EstadoEnvio;
}

export interface Estadisticas {
    totalEnvios: number;
    entregados: number;
    enTransito: number;
    pendientes: number;
    devueltos: number;
    porcentajeCumplimiento: number;
    enviosPorDia: { fecha: string; cantidad: number }[];
}

export interface RegisterData {
    email: string;
    password: string;
    nombre: string;
    telefono: string;
}

export interface LoginData {
    email: string;
    password: string;
}
