import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['cliente', Validators.required]
    });
  }

  async onRegister() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const { rol, ...data } = this.registerForm.value;

      await this.authService.register(
        data,
        rol as 'cliente' | 'repartidor' | 'administrador'
      );

    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.loading = false;
    }
  }

  // 🚀 AGREGADO: Login con Google
  async loginWithGoogle() {
    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.loginWithGoogle();
    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.loading = false;
    }
  }
}
