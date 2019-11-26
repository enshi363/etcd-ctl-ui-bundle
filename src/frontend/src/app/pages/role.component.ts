import { Component, OnInit, OnDestroy ,Input, TemplateRef} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { RoleService} from '../services';

@Component({
  // selector: 'login-root',
  templateUrl: './role.component.html',
  styles: [
  ]
})
export class RoleComponent implements OnInit, OnDestroy {
  roles:any[];
  loading :boolean;
  constructor(
    private location: Location,
    private roleService: RoleService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit(): void {
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
  editRole(role:string): void {
    const modal = this.modalService.create({
      nzTitle: 'Grant Role Permission',
      nzContent: RoleEditComponent,
      nzComponentParams: {
        role: role,
      },
      nzFooter: [
        {
          label: 'Save',
          onClick: componentInstance => {
          }
        }
      ]
    });
  }
}

@Component({
  // selector: 'login-root',
  templateUrl: './role-edit.component.html',
  styles: [
  ]
})
export class RoleEditComponent implements OnInit, OnDestroy {
  @Input() role: string;
  loading :boolean;
  dataSet:[]
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private roleService: RoleService,
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.roleService.GetRole(this.role).subscribe((res)=>{
      this.loading = false;
      this.dataSet = res.perm
    },(err)=>{
      this.loading = false;
    })
  }
  ngOnDestroy(): void {
    
  }
  onClose(): void {
  }
}