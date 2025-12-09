import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Usuario, RegisterData, LoginData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initAuthListener();
  }

  // LISTENER DE SESIÓN
  private initAuthListener() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const userData = await this.getUserData(user.uid);
        this.currentUserSubject.next(userData);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  // REGISTRO NORMAL
  async register(data: RegisterData, rol: 'cliente' | 'repartidor' | 'administrador' = 'cliente'): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      const usuario: Usuario = {
        uid: credential.user.uid,
        email: data.email,
        nombre: data.nombre,
        rol: rol,
        telefono: data.telefono,
        createdAt: new Date()
      };

      await setDoc(doc(this.firestore, 'usuarios', credential.user.uid), usuario);
      this.currentUserSubject.next(usuario);

      this.redirectByRole(rol);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // LOGIN NORMAL
  async login(data: LoginData): Promise<void> {
    try {
      const credential = await signInWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      const userData = await this.getUserData(credential.user.uid);
      if (!userData) throw new Error('No se pudo obtener los datos del usuario');

      this.currentUserSubject.next(userData);
      this.redirectByRole(userData.rol);

    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // 🚀 LOGIN CON GOOGLE
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      const user = credential.user;

      // Verificar si ya existe en Firestore
      let userData = await this.getUserData(user.uid);

      if (!userData) {
        // Si es primera vez, lo registramos
        userData = {
          uid: user.uid,
          email: user.email || '',
          nombre: user.displayName || '',
          telefono: user.phoneNumber || '',
          rol: 'cliente', // Rol por defecto
          createdAt: new Date()
        };

        await setDoc(doc(this.firestore, 'usuarios', user.uid), userData);
      }

      this.currentUserSubject.next(userData);
      this.redirectByRole(userData.rol);

    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // LOGOUT
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // OBTENER DATOS DEL USUARIO DESDE FIRESTORE
  async getUserData(uid: string): Promise<Usuario | null> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'usuarios', uid));
      if (userDoc.exists()) {
        return userDoc.data() as Usuario;
      }
      return null;
    } catch (error: any) {
      console.warn('Error al obtener datos del usuario:', error);
      return null;
    }
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(rol: string): boolean {
    return this.currentUserSubject.value?.rol === rol;
  }

  // REDIRECCIÓN SEGÚN ROL
  private redirectByRole(rol: 'cliente' | 'repartidor' | 'administrador') {
    if (rol === 'cliente') {
      this.router.navigate(['/dashboard/cliente']);
    } else if (rol === 'repartidor') {
      this.router.navigate(['/dashboard/repartidor']);
    } else {
      this.router.navigate(['/dashboard/admin']);
    }
  }

  // MANEJO DE ERRORES
  private handleError(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado';
      case 'auth/invalid-email':
        return 'Correo electrónico inválido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      default:
        return 'Error en la autenticación';
    }
  }
}
