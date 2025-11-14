 Sistema de Gestión de Envíos

Aplicación web desarrollada con Angular y Firebase que permite registrar, gestionar y hacer seguimiento de envíos. Incluye autenticación por roles: Cliente, Repartidor y Administrador.

Tecnologías Utilizadas

Angular 

TypeScript

Firebase Authentication

AngularFire

Git & GitHub

Node.js / npm

 Requisitos para Instalar y Ejecutar

Prerrequisitos

Node.js 

npm 

Angular 

Cuenta de Firebase

Configurar Firebase
Crear src/environments/environment.ts:

export const environment = {
  production: false,
  firebase: {
    apiKey: "TUS_DATOS",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "TUS_DATOS",
    appId: "TUS_DATOS"
  }
};


Ejecutar

ng serve

Arquitectura del Sistema (Resumen)

Componentes principales

Login / Register

Dashboard (vista por rol)

Cliente: Crear y ver envíos

Repartidor: Ver entregas asignadas y actualizar estado

Admin: Estadísticas y lista general

Servicios

auth.service: autenticación y roles

envio.service: CRUD de envíos

usuario.service: usuarios y repartidores

estadisticas.service: métricas del sistema

Guards

authGuard: protege rutas con login

roleGuard: protege rutas según rol

 URL del Deploy (Firebase Hosting)


Login y registro

Flujo de autenticación

Registro / lectura de datos en Firestore

Funciones del cliente (crear y ver envíos)

Funciones del repartidor (actualizar estados)

Panel del admin (estadísticas)

Breve explicación del código (componentes, servicios y guards)

 Manual de Usuario (Resumen)
 Cliente

Registrarse como Cliente

Crear nuevos envíos

Ver y filtrar sus envíos

Asignar repartidor a envíos pendientes

 Repartidor

Registrarse como Repartidor

Ver entregas asignadas

Marcar envío como Entregado o Devuelto

 Administrador

Ver estadísticas generales

Ver todos los envíos del sistema

 Licencia y Autor

Proyecto académico desarrollado para el curso de Desarrollo Web con Angular – UNAJMA
Autor: ALHUAY UQUICHE, ALEX JHON
