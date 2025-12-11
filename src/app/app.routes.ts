import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard, roleGuard } from './guards/auth.guard';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'cliente',
        pathMatch: 'full'
      },
      {
        path: 'cliente',
        loadComponent: () => import('./components/cliente/cliente.component').then(m => m.ClienteComponent),
        canActivate: [roleGuard(['cliente'])]
      },
      {
        path: 'nuevo-envio',
        loadComponent: () => import('./components/nuevo-envio/nuevo-envio.component').then(m => m.NuevoEnvioComponent),
        canActivate: [roleGuard(['cliente'])]
      },
      {
        path: 'repartidor',
        loadComponent: () => import('./components/repartidor/repartidor.component').then(m => m.RepartidorComponent),
        canActivate: [roleGuard(['repartidor'])]
      },
      {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [roleGuard(['administrador'])]
      },
      {
        path: 'envios',
        loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [roleGuard(['administrador'])]
      },
      {
        path: 'predicciones',
        loadComponent: () => import('./predicciones/predicciones.component').then(m => m.PrediccionesComponent),
        canActivate: [roleGuard(['administrador'])]
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
