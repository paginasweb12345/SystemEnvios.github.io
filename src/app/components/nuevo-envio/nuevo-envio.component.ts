import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EnvioService } from '../../services/envio.service';
import { AuthService } from '../../services/auth.service';
import { Envio } from '../../models/models';

@Component({
  selector: 'app-nuevo-envio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './nuevo-envio.component.html',
  styleUrls: ['./nuevo-envio.component.css']
})
export class NuevoEnvioComponent implements OnInit {
  envioForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private envioService: EnvioService,
    private authService: AuthService,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    
    this.envioForm = this.fb.group({
      remitente: ['', Validators.required],
      destinatario: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [''],
      fecha_envio: [today, Validators.required],
      costo: [0, [Validators.required, Validators.min(0)]],
      descripcion: ['']
    });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.envioForm.patchValue({
        remitente: user.nombre
      });
    }
  }

  async onSubmit() {
    if (this.envioForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const user = this.authService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const envio: Envio = {
        ...this.envioForm.value,
        userId: user.uid,
        estado: 'pendiente'
      };

      await this.envioService.crearEnvio(envio);
      
      this.successMessage = '¡Envío registrado exitosamente!';
      this.envioForm.reset();
      
      setTimeout(() => {
        this.router.navigate(['/dashboard/cliente']);
      }, 2000);
    } catch (error) {
      console.error('Error al crear envío:', error);
      this.errorMessage = 'Error al registrar el envío. Intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  }
}
