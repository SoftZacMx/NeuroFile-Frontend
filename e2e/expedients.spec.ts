/// <reference types="node" />
import { test, expect } from "@playwright/test";

const LOGIN_EMAIL = process.env.E2E_LOGIN_EMAIL ?? "";
const LOGIN_PASSWORD = process.env.E2E_LOGIN_PASSWORD ?? "";

test.describe("Expedientes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
      test.skip(true, "E2E_LOGIN_EMAIL y E2E_LOGIN_PASSWORD deben estar definidos");
      return;
    }
    await page.getByTestId("login-email").fill(LOGIN_EMAIL);
    await page.getByTestId("login-password").fill(LOGIN_PASSWORD);
    await page.getByTestId("login-submit").click();
    await expect(page).toHaveURL(/\/(dashboard|records)/);
  });

  test("crear expediente: seleccionar paciente, rellenar paso 1, avanzar y guardar", async ({
    page,
  }) => {
    await page.goto("/records/new");
    await expect(page.getByRole("heading", { name: /historia clínica/i })).toBeVisible();

    const nextButton = page.getByTestId("expedient-next");
    await expect(nextButton).toBeDisabled();

    await page.getByTestId("expedient-select-patient").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByTestId("patient-select-btn").first().click();

    await page.getByTestId("expedient-consultation-reason").fill("E2E motivo de consulta");
    await page.getByTestId("expedient-treatment-demand").fill("E2E demanda de tratamiento");
    await expect(nextButton).toBeEnabled();

    for (let i = 0; i < 4; i++) {
      await nextButton.click();
    }

    await expect(page.getByTestId("expedient-submit")).toBeVisible();
    await page.getByTestId("expedient-submit").click();

    await expect(page).toHaveURL(/\/records$/);
    await expect(page.getByText("Expediente creado correctamente")).toBeVisible();
  });

  test("listado de expedientes muestra la página y botón nuevo", async ({ page }) => {
    await page.goto("/records");
    await expect(page.getByTestId("records-page")).toBeVisible();
    await expect(page.getByTestId("records-new-expedient-link")).toBeVisible();
  });
});
