//  Modelo de Envío
export interface Envio {
  id?: string;
  remitente: string;
  destinatario: string;
  direccion: string;
  fecha_envio: Date | string;
  estado: EstadoEnvio;
  costo: number;
  userId: string;
  repartidorId?: string;
  telefono?: string;
  descripcion?: string;
}

// Estados posibles del envío
export type EstadoEnvio = 'pendiente' | 'en_transito' | 'entregado' | 'devuelto';

// 👤 Modelo de Usuario
export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  telefono?: string;
  createdAt?: Date | string;
}

// Roles de usuario
export type RolUsuario = 'cliente' | 'repartidor' | 'administrador';

// Estadísticas para el panel administrativo
export interface Estadisticas {
  totalEnvios: number;
  entregados: number;
  enTransito: number;
  pendientes: number;
  devueltos: number;
  porcentajeCumplimiento: number;
  enviosPorDia: { fecha: string; cantidad: number }[];
}

//  Datos de autenticación
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  nombre: string;
  telefono?: string;
}
