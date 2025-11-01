import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import {DividerModule} from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule, CheckboxModule, MessagesModule, MessageModule, DividerModule, ProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    console.log('Login exitoso', this.loginForm.value);
  }

  get f() {
    return this.loginForm.controls;
  }

  FormControlNameHasError(controlName:string,errorType:string):boolean{
    return this.loginForm.controls[controlName].hasError(errorType) && this.loginForm.controls[controlName].touched;
  }

  FormControlIsInvalid(controlName:string):boolean{
    return this.loginForm.controls[controlName].invalid && this.loginForm.controls[controlName].touched;
  }
    showPass = false;

  
}
