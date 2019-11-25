import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';

// import { AuthService, loginData } from './services/auth.service';

@Component({
  // selector: 'login-root',
  templateUrl: './login.component.html',
  styles: [
    `
      .login-form {
        float: left;
        display: block;
        margin-top: 200px;
        margin-right: 50px;
        margin-left: 20px;
        width: 30%;
      }
      .logo {
        float: left;
        width: 60%;
        border-right: 2px solid #ccc;
        height: 300px;
        margin: 120px auto;
        background: url(./assets/logo.png) no-repeat center;
      }
      .login-form-button {
        width: 100%;
      }
      .login-container {
        margin: 0;
        background: url(./assets/login_bg.jpg) no-repeat;
        height: 100%;
      }
    `
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLogin = false;
  validateForm: FormGroup;
  countdown = 0;
  timer;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
  ) {
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
  }


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.timer = null;
  }
}
