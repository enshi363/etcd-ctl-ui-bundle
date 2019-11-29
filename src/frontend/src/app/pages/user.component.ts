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

import { UserService,User, RoleService,BreadCrumb,BreadCrumbService} from '../services';
import { switchMap } from 'rxjs/operators';

@Component({
  providers: [],
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
  isEdit = false;
  editUserName = "";
  constructor(
    private location: Location,
    private userService: UserService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private bService:BreadCrumbService
  ) {
    const b :BreadCrumb[]=[
      {name:"settings",icon:"control",url:"/settings/user",param:''},
      {name:"user",icon:"user",url:"",param:''},
    ]
    this.bService.BroadCastData(b)
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
    this.isEdit = false;
  }
  CreateUser(): void {
    this.isEdit = false;
    this.validateForm.reset()
    this.isVisible = true;
    this.isOkLoading = false;
    this.errors = "";
  }
  modify(username:string) :void{
    this.validateForm.reset()
    this.validateForm.get("userName").setValue(username)
    this.validateForm.get("userName").disable()
    this.isVisible = true;
    this.isOkLoading = false;
    this.errors = "";
    this.isEdit = true;
    this.editUserName = username
  }
  RemoveUser(username:string):void{
    this.userService.RemoveUser(username).subscribe(res=>{
      this.loadUsers();
    },err=>{
      this.message.create('error', err.error.error);
    })
  }
  handleOk(): void {
    if(this.isEdit&&this.validateForm.get('password').value==""){
      // ignore password if it is empty while modify
      return ;
    }
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
    if (this.isEdit) {
      this.userService.ChangePassword(u).subscribe((res) => {
        this.isOkLoading = false;
        this.isVisible = false;
      }, (err) => {
        this.errors = err.error.error;
        this.isOkLoading = false;
      })
    } else {
      this.userService.AddUser(u).subscribe((res) => {
        this.isOkLoading = false;
        this.isVisible = false;
        this.loadUsers();
      }, (err) => {
        this.errors = err.error.error;
        console.log(err)
        this.isOkLoading = false;
      })

    }
  }
}

@Component({
  selector: 'user-detail',
  providers: [],
  template: `
    <nz-skeleton [nzActive]="true" [nzLoading]="loading" style="width:70%;">
      <div *ngIf="roles.length==0">no roles attached</div>
      <strong *ngIf="roles.length>0">Roles:</strong>
      <ng-container *ngIf="!showAllRoles">
      <span nz-text *ngFor="let r of roles"><mark>{{r}}</mark></span>
      </ng-container>
      <ng-container *ngIf="showAllRoles">
        <br/>
        <nz-badge [nzCount]="r.loading?loadingTemplate:(r.selected?iconTemplate:false)" *ngFor="let r of roles" style="margin-right:20px;">
          <a nz-text (click)="checkChange(r)" >{{r.name}}</a>
        </nz-badge>
        <ng-template #iconTemplate>
          <i nz-icon nzType="check-circle" class="ant-scroll-number-custom-component" style="color: green;"></i>
        </ng-template>
        <ng-template #loadingTemplate>
          <i nz-icon nzType="loading" nzTheme="outline" class="ant-scroll-number-custom-component"></i>
        </ng-template>
      </ng-container>
    </nz-skeleton>
  `,
  styles: [
    
  ]
})
export class UserDetailComponent{
  @Input("username") username:string
  @Input("showAllRoles") showAllRoles:boolean 
  loading = false;
  roles:any[] = [];
  constructor(
    private location: Location,
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
  }

  // only load user roles
  loadUserRole():void{
    this.loading=true;
    this.userService.GetUser(this.username).subscribe(res=>{
      this.roles = res.roles || []
      this.loading = false;
    },err=>{
      this.loading = false;
    });
  }

  // merge role and user role together
  mergUserAndRoles(): void {
    let roles = [];
    this.loading=true;
    this.userService.GetUser(this.username).pipe(switchMap(v=>{
      if (v.roles!=null){
        roles = v.roles;
      }
      return this.roleService.GetList()
    })).subscribe(res=>{
      this.roles = res.roles.map((r)=>{
        return {
          name:r,
          loading:false,
          selected:roles.indexOf(r)==-1?false:true
        }
      })
      this.loading=false;
    },err=>{
      console.log(err)
      this.loading=false;
    })
  }
  checkChange(role):void{
    const index = this.roles.findIndex((r)=>r.name==role.name)
    this.roles[index].loading = true
    const user :User = {
      user:this.username,
      role:role.name,
      password:null
    }
    if(this.roles[index].selected==true){
      // revoke role
      this.userService.RevokeUserRole(user).subscribe(res=>{
        this.roles[index].loading = false
        this.roles[index].selected = false
      },err=>{
        this.roles[index].loading = false
        this.message.error(err.error.error)
      })
    }else{
      // grant role
      this.userService.GrantUserRole(user).subscribe(res=>{
        this.roles[index].loading = false
        this.roles[index].selected = true 
      },err=>{
        this.roles[index].loading = false
        this.message.error(err.error.error)
      })
    }
  }

  ngOnInit(): void {
    // this.loading=true;
    if (!this.username) return;
    if(this.showAllRoles==true){
      this.mergUserAndRoles()
    }else{
      this.loadUserRole()
    }
  }
  loadUsers():void{
    
  }
}