# E2E Expedientes con Playwright

Fases para tener tests end-to-end de expedientes, desde la instalación hasta la ejecución.

---

## 1. Instalación

En la raíz del frontend:

```bash
cd NeuroFile-Frontend
npm init playwright@latest
```

- Elegir **TypeScript**, **tests en `e2e/`**, **no** instalar proyectos de ejemplo si se prefiere empezar desde cero.
- Se añaden `@playwright/test` y los browsers (Chromium, Firefox, WebKit) en `node_modules` o en cache global según la opción elegida.

Alternativa sin asistente:

```bash
npm install -D @playwright/test
npx playwright install
```

---

## 2. Configuración

**Archivo:** `playwright.config.ts` en la raíz del frontend.

- **baseURL:** URL del frontend en ejecución (ej. `http://localhost:5173`).
- **timeout** por test/assertion si hace falta.
- **webServer:** opcional; que Playwright arranque `npm run dev` antes de los tests y espere a que esté listo.

Ejemplo mínimo:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

La API (backend) **no** la arranca Playwright: debe estar corriendo por tu cuenta o con otro script/CI.

---

## 3. Prerrequisitos para expedientes

- **Frontend** sirviendo en `baseURL`.
- **API** corriendo y accesible desde el navegador (misma máquina o URL configurada en el frontend).
- **Datos de test:** al menos un paciente existente (ej. para seleccionar en “Crear expediente”). Si la API arranca con BD vacía, hace falta un seed o un paso en el test que cree el paciente (si el flujo lo permite).

---

## 4. Estructura de tests (expedientes)

- **Carpeta:** `e2e/` (o la que hayas puesto en `testDir`).
- **Archivo sugerido:** `e2e/expedients.spec.ts`.

Flujo típico del test de **creación**:

1. Ir a la ruta de nuevo expediente (ej. `/expedients/new`).
2. Clic en “Seleccionar paciente” y elegir un paciente de la lista.
3. Rellenar “Motivo de consulta” y “Demanda de tratamiento”.
4. Avanzar por los pasos (Siguiente) hasta el último.
5. Clic en “Guardar expediente”.
6. Comprobar que se redirige o se muestra mensaje de éxito (y, si aplica, que el expediente aparece en lista o detalle).

Opcional: test de **listado** (entrar a expedientes y comprobar que hay tabla o lista).

---

## 5. Ejecución

- **Una vez:** frontend y API levantados (salvo que uses `webServer` para el frontend).

```bash
# Todos los e2e
npx playwright test

# Solo expedientes
npx playwright test e2e/expedients.spec.ts

# Con UI de Playwright
npx playwright test --ui

# Un navegador
npx playwright test --project=chromium
```

Añadir en `package.json` si quieres:

```json
"scripts": {
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## Resumen de fases

| Fase | Acción |
|------|--------|
| 1. Instalación | `npm init playwright@latest` (o `npm i -D @playwright/test` + `npx playwright install`) |
| 2. Configuración | `playwright.config.ts` con `baseURL`, opcional `webServer` |
| 3. Prerrequisitos | API + frontend (y datos de test: paciente) |
| 4. Tests | `e2e/expedients.spec.ts`: flujo crear expediente (y opcional listado) |
| 5. Ejecución | `npx playwright test` o `npm run test:e2e` |
