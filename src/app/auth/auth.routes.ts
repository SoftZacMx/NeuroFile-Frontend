import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
export const authRoutes: Routes = [
  
    
    
      {
        path: "login",
        loadComponent: () =>
          import("./components/login/login.component").then((m) => m.LoginComponent),
      },
      {
        path: "verify-user",
        loadComponent: () =>
          import("./components/verify-user/verify-user.component").then((m) => m.VerifyUserComponent),
      },
      {
        path: "register",
        loadComponent: () =>
          import("./components/reset-password/reset-password.component").then((m) => m.ResetPasswordComponent),
      },
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      }
    
  
];
