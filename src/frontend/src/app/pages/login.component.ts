import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';

import { AuthService, Profile } from '../services/auth.service';

@Component({
  // selector: 'login-root',
  templateUrl: './login.component.html',
  styles: [
    `
      .login-form{
        width: 60%;
        margin: 20px auto;
        padding:24px;
      }
      .remove-link {
        float: right;
      }
    `
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLogin = false;
  validateForm: FormGroup;
  errors: string;
  loading = false
  profiles: string[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService,
    private authService: AuthService,
  ) {
  }
  submitForm(): void {
    this.errors = ""
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.validateForm.get("endpoints").value).subscribe((res) => {
      this.loading = false;
      this.router.navigate(['/status']);
    }, (err) => {
      this.loading = false;
      this.errors = err.error.error
    })

    // this.authService.login(this.validateForm.get("username").value,this.validateForm.get("password").value).subscribe((res)=>{
    //   this.router.navigate(['/status']);
    // },(err)=>{
    //   this.errors = err.error.error
    // })
  }
  onInput(value: string): void {
    this.profiles = this.authService.GetProfiles()
    this.profiles = this.profiles.filter(p => {
      return p.indexOf(value) != -1;
    })
    // this.options = value ? [value, value + value, value + value + value] : [];
  }
  remove(profile: string): void {
    this.authService.RemoveProfile(profile)
    this.profiles = this.authService.GetProfiles()
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      endpoints: [null, [Validators.required]],
    });
    this.profiles = this.authService.GetProfiles()
  }
  ngOnDestroy(): void {

  }
}
