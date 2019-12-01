import { Component, OnInit, OnDestroy, ViewChild,ElementRef} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { KvService, BreadCrumb, BreadCrumbService, KVS } from '../services';
import { delay } from 'rxjs/operators';

@Component({
  providers: [],
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
  kvs: KVS[];
  loading: boolean;
  isVisible = false;
  isOkLoading = false;
  validateForm: FormGroup;
  errors = "";
  prefixKey = "/";
  isEdit = true; 
  searchPrefix=""
  @ViewChild('search',{static:true}) searchElement: ElementRef;

  constructor(
    private location: Location,
    private kvService: KvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private bService: BreadCrumbService,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService
  ) {
    const b: BreadCrumb[] = [
      { name: "KVs", icon: "container", url: "/KVs" ,param:""},
    ]
    this.bService.BroadCastData(b)
    this.validateForm = this.fb.group({
      keyName: [null, [Validators.required]],
      content: [null],
      ttl: [null],
    });
  }
  updatePrefix($event):void{
    if ($event.target.value.charAt(0)!="/" && $event.target.value){
      $event.target.value = "/" + $event.target.value
    }
    this.prefixKey = $event.target.value || "/"
  }
  handleCancel(): void {
    this.isVisible = false;
    this.isEdit = false;
  }
  focusSearch(){
    this.searchElement.nativeElement.focus();
  }
  ngOnInit(): void {
    this.activatedRoute.params.pipe(delay(300)).subscribe(res => {
      this.prefixKey = res.prefix || "/"
      let path = this.prefixKey.split("/")
      let b: BreadCrumb[] = [
        { name: "KVs", icon: "container", url: "/KVs" ,param:""},
      ]
      let prev="/"
      path.forEach((k, v) => {
        if (k != "") {
          b.push({
            name: k,
            icon: "",
            url: "/KVs",
            param: {
              prefix: prev+k+"/"
            }
          })
          prev = prev+k+"/"
        }
      })
      this.bService.BroadCastData(b)

      this.loadKvs()
    })
    // this.router.snapshot
  }
  loadKvs(): void {
    this.loading = true;
    this.kvService.GetList(this.prefixKey).subscribe(res => {
      // console.log(res)
      this.loading = false;
      this.kvs = res
    }, err => {
      this.loading = false;
      this.message.error(err.error.error)
    })
  }
  CreateKV():void{
    this.isEdit = false;
    this.validateForm.reset()
    this.isVisible = true;
    this.isOkLoading = false;
    this.errors = "";
    this.validateForm.get('keyName').enable();
  }

  ModifyKV(k:string):void{
    this.isEdit = false;
    this.validateForm.reset()
    this.isVisible = true;
    this.isOkLoading = false;
    this.errors = "";
    this.kvService.GetK(this.prefixKey+k).subscribe(res=>{
      this.validateForm.get('keyName').setValue(k);
      this.validateForm.get('keyName').disable();
      this.validateForm.get('content').setValue(res.value);
    })

  }

  onChangeKey($event): void {
    if(this.validateForm.get("keyName").value.charAt(this.validateForm.get("keyName").value.length-1)=="/"){
      // this.validateForm.get("content").setValue("")
      this.validateForm.get("content").disable()
    }else{
      this.validateForm.get("content").enable()
    }
  }
  ngOnDestroy(): void {

  }
  onBack(): void {
    this.location.back()
  }
  RemoveKey(k:string):void{
    this.kvService.RemoveK(this.prefixKey+k).subscribe(res=>{
      this.message.success("remove key success")
      this.loadKvs()
    },err=>{
      this.message.error(err.error.error)
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
    const k = this.prefixKey+this.validateForm.get('keyName').value;
    this.kvService.PutK(k,this.validateForm.get('content').value,this.validateForm.get('ttl').value||0).subscribe(res=>{
      this.isVisible = false;
      this.isOkLoading = false;
      this.loadKvs()
    },err=>{
      this.isVisible = false;
      this.isOkLoading = false;
    })
  }

}