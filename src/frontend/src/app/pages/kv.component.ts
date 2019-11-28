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

import { KvService} from '../services';

@Component({
  providers: [KvService],
  templateUrl: './kv.component.html',
  styles: [
    `
      .head-action{
        margin-bottom:20px;
      }
      .kv-content{
          width:60%;
      }
    `
  ]
})
export class KvComponent implements OnInit, OnDestroy {
  kvs:any[];
  loading :boolean;
  isVisible = false;
  isOkLoading = false;
  validateForm: FormGroup;
  errors = "";
  constructor(
    private location: Location,
    private kvService: KvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
  }

  ngOnInit(): void {
    this.loadKvs()
  }
  loadKvs():void{
    this.kvService.GetList("/").subscribe(res=>{
        console.log(res)
        this.kvs = res.kvs
    },err=>{})
  }
  onChange($event):void{
      console.log($event)
  }
  ngOnDestroy(): void {
    
  }
  onBack(): void {
    this.location.back()
  }
  
  
}