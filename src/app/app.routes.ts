import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { NuevoEnvioComponent } from './components/nuevo-envio/nuevo-envio.component';
import { RepartidorComponent } from './components/repartidor/repartidor.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard, roleGuard } from './guards/auth.guard';
import { PrediccionesComponent } from './predicciones/predicciones.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
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
        component: ClienteComponent,
        canActivate: [roleGuard(['cliente'])]
      },
      {
        path: 'nuevo-envio',
        component: NuevoEnvioComponent,
        canActivate: [roleGuard(['cliente'])]
      },
      {
        path: 'repartidor',
        component: RepartidorComponent,
        canActivate: [roleGuard(['repartidor'])]
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [roleGuard(['administrador'])]
      },
      {
        path: 'envios',
        component: AdminComponent,
        canActivate: [roleGuard(['administrador'])]
      },
      {
        path: 'predicciones',
        component: PrediccionesComponent,
        canActivate: [roleGuard(['administrador'])]
      }

    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
