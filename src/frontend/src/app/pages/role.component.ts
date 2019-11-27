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

import { RoleService,Role} from '../services';

@Component({
  providers: [RoleService],
  templateUrl: './role.component.html',
  styles: [
    `
      .head-action{
        margin-bottom:20px;
      }
    `
  ]
})
export class RoleComponent implements OnInit, OnDestroy {
  roles:any[];
  loading :boolean;
  isVisible = false;
  isOkLoading = false;
  validateForm: FormGroup;
  errors = "";
  constructor(
    private location: Location,
    private roleService: RoleService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      roleName: [null, [Validators.required]],
    });
    this.loadRoles();
  }
  loadRoles():void{
    this.loading = true;
    this.roleService.GetList().subscribe((res)=>{
      this.loading = false;
      this.roles = res.roles
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
  CreateRole(): void {
    this.isVisible = true;
    this.isOkLoading = false;
    this.errors = "";
  }
  RemoveRole(r:string):void{
    this.roleService.RemoveRole(r).subscribe(res=>{
      this.loadRoles();
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
    let role :Role = {
      name:this.validateForm.get('roleName').value,
      key:null,
      endKey:null,
      t:null
    }
    this.roleService.AddRole(role).subscribe((res)=>{
      this.isOkLoading = false;
      this.isVisible = false;
      this.loadRoles();
    },(err)=>{
      this.errors = err.error.error;
      console.log(err)
      this.isOkLoading = false;
    })
    
  }
  editRole(role:string): void {
    const modal = this.modalService.create({
      nzTitle: 'Grant Role Permission',
      nzContent: RoleEditComponent,
      nzWidth:"70%",
      nzComponentParams: {
        role: role,
      },
      nzFooter:null
    });
  }
}

@Component({
  templateUrl: './role-edit.component.html',
  providers: [RoleService],
  styles: [
  ]
})
export class RoleEditComponent implements OnInit, OnDestroy {
  @Input() role: string;
  loading :boolean;
  dataSet: any[];
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  validateForm: FormGroup;
  errors = "";
  isOkLoading=false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private roleService: RoleService,
    private message: NzMessageService
  ) {
  }

  loadPermission():void{
    this.loading = true;
    this.roleService.GetRole(this.role).subscribe((res)=>{
      this.loading = false;
      this.dataSet = res.perm ||[]
    },(err)=>{
      this.dataSet = []
      this.loading = false;
    })
  }
  GrantPermission():void{
    this.isOkLoading = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    let role :Role = {
      name:this.role,
      key:this.validateForm.get("key").value,
      endKey:this.validateForm.get("rangeEnd").value,
      t:parseInt(this.validateForm.get('permType').value)
    }
    this.roleService.GrantRolePermission(role).subscribe(res=>{
      this.isOkLoading = false;
      this.router.navigateByUrl("/settings/role?tab=1");
      this.loadPermission();
    },err=>{
      this.errors = err.error.error;
      this.isOkLoading = false;
    })
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      key: [null, [Validators.required]],
      rangeEnd: [null],
      permType: [null,[Validators.required]],
    });
    this.loadPermission()
  }
  ngOnDestroy(): void {
    
  }
  RevokePermission(r:Role):void{
    this.loading = true; 
    this.roleService.RevokeRolePermission(r).subscribe(res=>{
      this.loadPermission()
    },err=>{
      this.message.create('error', err.error.error);
    })
  }
  onClose(): void {
  }
}