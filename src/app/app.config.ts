import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from "./app.routes";



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura, // 🎨 Aquí activas el tema Aura (claro)
        options: {
          // Opcional: aquí puedes personalizar colores globales
          primary: '#0284c7',      // azul tipo sky-600
          surface: '#ffffff',
          textColor: '#1f2937',
          borderRadius: '12px',    // bordes redondeados globales
        },
      },
      ripple: true, // habilita el efecto de ripple en botones
    }),
  ],
};
