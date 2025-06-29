import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
  {
    path: "dashboard",
    loadComponent: () =>
      import("./components/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: "users",
    loadComponent: () =>
      import("./components/users/user-list/user-list.component").then(
        (m) => m.UserListComponent
      ),
  },
  {
    path: "patients",
    loadComponent: () =>
      import(
        "./components/patients/patients-list/patients-list.component"
      ).then((m) => m.PatientsListComponent),
  },

  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
];
