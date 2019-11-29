import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

import { NzNotificationService } from 'ng-zorro-antd';

import { ClusterService ,BreadCrumbService,BreadCrumb} from '../services';

@Component({
  providers: [],
  templateUrl: './cluster.component.html',
  styles: [
  ]
})
export class ClusterComponent implements OnInit, OnDestroy {
  clusters:any[];
  loading :boolean;
  constructor(
    private location: Location,
    private notification: NzNotificationService,
    private clusterService: ClusterService,
    private bService:BreadCrumbService
  ) {
    const b :BreadCrumb[]=[
      {name:"cluster",icon:"",url:"/status",param:''},
      {name:"status",icon:"",url:"",param:''},
    ]
    this.bService.BroadCastData(b)
  }

  ngOnInit(): void {
    this.loading = true;
    this.clusterService.status().subscribe((res)=>{
      this.loading = false;
      this.clusters = res.members
    },(err)=>{
      this.loading = false;
    })
  }
  ngOnDestroy(): void {
    
  }
  onBack(): void {
    this.location.back()
  }
}
