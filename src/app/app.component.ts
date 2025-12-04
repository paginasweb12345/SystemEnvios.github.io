import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './extremos/header/header.component';
import { FooterComponent } from './extremos/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <app-header></app-header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `,
  styles: []
})
export class AppComponent {
  title = 'sistema-envios';
}
