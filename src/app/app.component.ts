
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `
        <div class="app-container">
            <header class="app-header">
                <div class="header-content">
                    <div class="logo-container">
                        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                            <path d="M20 6L12 1L4 6V18L12 23L20 18V6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h1 class="app-title">Sistema de Envíos</h1>
                    </div>
                </div>
            </header>
            
            <main class="app-main">
                <router-outlet></router-outlet>
            </main>
            
            <footer class="app-footer">
                <div class="footer-content">
                    <p class="footer-text">
                        <span class="footer-brand">Sistema de Envíos</span>
                        <span class="footer-separator">•</span>
                        <span class="footer-author">Hecho por <strong>allexDev</strong></span>
                    </p>
                </div>
            </footer>
        </div>
    `,
    styles: [`
        .app-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .app-header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
            position: sticky;
            top: 0;
            z-index: 1000;
            backdrop-filter: blur(10px);
        }

        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.25rem 2rem;
            display: flex;
            justify-content: center;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .logo-icon {
            width: 32px;
            height: 32px;
            color: white;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .app-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            margin: 0;
            letter-spacing: -0.025em;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .app-main {
            flex: 1;
            width: 100%;
        }

        .app-footer {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-top: 1px solid rgba(99, 102, 241, 0.2);
            margin-top: auto;
        }

        .footer-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.5rem 2rem;
            text-align: center;
        }

        .footer-text {
            color: #cbd5e1;
            font-size: 0.875rem;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            flex-wrap: wrap;
        }

        .footer-brand {
            color: #e2e8f0;
            font-weight: 500;
        }

        .footer-separator {
            color: #64748b;
        }

        .footer-author {
            color: #94a3b8;
        }

        .footer-author strong {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            transition: all 0.3s ease;
        }

        .footer-author strong:hover {
            filter: brightness(1.2);
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .header-content {
                padding: 1rem 1.5rem;
            }

            .app-title {
                font-size: 1.25rem;
            }

            .logo-icon {
                width: 28px;
                height: 28px;
            }

            .footer-content {
                padding: 1.25rem 1.5rem;
            }

            .footer-text {
                font-size: 0.8125rem;
                gap: 0.5rem;
            }
        }
    `]
})
export class AppComponent { }
