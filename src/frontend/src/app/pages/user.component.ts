import { Component, OnInit, OnDestroy ,Input } from '@angular/core';
import {  NzModalService } from 'ng-zorro-antd/modal';

import {Location} from '@angular/common';
import { Router} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { UserService,User} from '../services';

@Component({
  providers: [UserService],
  templateUrl: './user.component.html',
  styles: [
    `
      .head-action{
        margin-bottom:20px;
      }
    `
  ]
})
export class UserComponent implements OnInit, OnDestroy {
  users:any[];
  loading :boolean;
  isVisible = false;
  isOkLoading = false;
  validateForm: FormGroup;
  errors = "";
  constructor(
    private location: Location,
    private userService: UserService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null],
    });
    this.loadUsers();
  }
  loadUsers():void{
    this.loading = true;
    this.userService.GetList().subscribe((res)=>{
      this.loading = false;
      this.users = res.users;
      // console.log(res)
    },(err)=>{
      this.loading = false;
    })
  }
  ngOnDestroy(): void {
    
  }
  onBack(): void {
    this.location.back()
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  CreateUser(): void {
    this.isVisible = true;
    this.isOkLoading = false;
    this.errors = "";
  }
  RemoveUser(username:string):void{
    this.userService.RemoveUser(username).subscribe(res=>{
      this.loadUsers();
    },err=>{
      this.message.create('error', err.error.error);
    })
  }
  handleOk(): void {
    this.isOkLoading = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      this.isOkLoading = false;
      return;
    }
    let u:User= {
      user:this.validateForm.get('userName').value,
      password:this.validateForm.get('password').value,
      role:null,
    }
    this.userService.AddUser(u).subscribe((res)=>{
      this.isOkLoading = false;
      this.isVisible = false;
      this.loadUsers();
    },(err)=>{
      this.errors = err.error.error;
      console.log(err)
      this.isOkLoading = false;
    })
    
  }
}

@Component({
  selector: 'user-detail',
  providers: [UserService],
  template: `
    <nz-skeleton [nzActive]="true" [nzLoading]="loading">

    </nz-skeleton>
  `,
  styles: [
    
  ]
})
export class UserDetailComponent{
  @Input() username:string
  loading = false;
  constructor(
    private location: Location,
    private userService: UserService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit(): void {
    this.loading=true;
    this.userService.GetUser(this.username).subscribe(res=>{
      console.log(res)
      this.loading = false;
    },err=>{
      this.loading = false;
    })
  }
  loadUsers():void{
    
  }
}