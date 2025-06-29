import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { VerifyUserComponent } from './auth/components/verify-user/verify-user.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-root',
  imports: [
    LoginComponent,
    ResetPasswordComponent,
    CommonModule,
    ReactiveFormsModule
    

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'NeuroFile-Frontend';
}
