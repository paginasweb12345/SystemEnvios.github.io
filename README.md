Sistema de Gestión de Envíos

Aplicación web desarrollada con Angular y Firebase que permite registrar, rastrear y actualizar envíos. Incluye autenticación por roles: Cliente, Repartidor y Administrador.

Tecnologías y Herramientas Utilizadas

Frontend: Angular, TypeScript
Backend y Base de Datos: Firebase Authentication, AngularFire
Desarrollo: Angular CLI, GitHub, Node.js & npm

Requisitos para Instalar y Ejecutar

Prerrequisitos: Node.js, npm, Angular CLI, cuenta de Firebase.
Se debe clonar el repositorio, instalar dependencias, configurar Firebase y ejecutar la aplicación para desarrollo.

Arquitectura (Resumen)

Componentes principales:
Login / Register, Dashboard según rol, Cliente: Crear y ver envíos, Repartidor: Ver entregas y actualizar estado, Admin: Estadísticas y lista de todos los envíos.

Servicios principales:
auth.service: Autenticación y roles
envio.service: CRUD de envíos
usuario.service: Gestión de usuarios
estadisticas.service: Métricas y estadísticas

Guards:
authGuard: Protege rutas autenticadas
roleGuard: Protege rutas según rol

Manual de Usuario

Cliente: Registrarse y autenticarse, crear nuevos envíos, ver y filtrar envíos, asignar repartidor a envíos pendientes.

Repartidor: Registrarse y autenticarse, ver entregas asignadas, marcar envío como Entregado o Devuelto.

Administrador: Visualizar estadísticas del sistema, ver todos los envíos del sistema.



MI URL DE HOSTING FUNCIONAL
Hosting URL: https://systemenviosalex123.web.app



MI URL DE MI GIT HUB
https://github.com/paginasweb12345/SystemEnvios.github.io.git



MI URL DE MI VIDEO DE EXPLICACION 


https://drive.google.com/file/d/1rTjulkCmMHzPAtb0StlthtLH1vgamoDf/view?usp=sharing





RESUMEN COMPLETO DE MI PROYECTO
src/
├── app/
│   ├── components/
│   │   ├── login/             # Componente de inicio de sesión
│   │   ├── register/          # Componente de registro
│   │   ├── dashboard/         # Contenedor principal
│   │   ├── cliente/           # Vista de envíos para clientes
│   │   ├── repartidor/        # Vista de entregas para repartidores
│   │   └── admin/             # Panel administrativo
│   ├── services/              # Servicios (Auth, Envíos, Usuarios)
│   ├── guards/                # Protección de rutas (authGuard, roleGuard)
│   └── models/                # Interfaces TypeScript
├── assets/                    # Imágenes, estilos, iconos
├── environments/              # Configuración de Firebase
└── index.html                  # Página principal


Autor: ALHUAY UQUICHE, ALEX JHON
Proyecto académico – UNAJMA, Diciembre 2025
