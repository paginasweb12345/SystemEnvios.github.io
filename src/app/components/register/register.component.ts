import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    errorMessage: string = '';
    loading: boolean = false;

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    constructor() {
        this.registerForm = this.fb.group({
            nombre: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            telefono: [''],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rol: ['cliente', [Validators.required]]
        });
    }

    async onRegister() {
        if (this.registerForm.invalid) return;

        this.loading = true;
        this.errorMessage = '';

        const { nombre, email, password, telefono, rol } = this.registerForm.value;

        try {
            await this.authService.register({
                nombre,
                email,
                password,
                telefono
            }, rol);

            // La redirección la maneja el servicio
        } catch (error: any) {
            this.errorMessage = error; // El servicio devuelve un string amigable
        } finally {
            this.loading = false;
        }
    }

    async loginWithGoogle() {
        try {
            await this.authService.loginWithGoogle();
        } catch (error: any) {
            this.errorMessage = error;
        }
    }
}
