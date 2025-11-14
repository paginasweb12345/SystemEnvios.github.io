import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// 🔐 Guard para rutas protegidas
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// 🎭 Guard para roles específicos
export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const usuario = authService.getCurrentUser();

    if (!usuario) {
      router.navigate(['/login']);
      return false;
    }

    if (rolesPermitidos.includes(usuario.rol)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};
