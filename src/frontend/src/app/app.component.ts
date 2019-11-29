import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { BreadCrumbService,BreadCrumb} from './services/breadcrumb.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'etcd web ui';
    breads :BreadCrumb[];
    constructor(
        private router: Router,
        private bService:BreadCrumbService
    ) {
        this.bService.GetCrumbData().subscribe(res=>{
            this.breads = res
        })
    }
    ngOnInit():void{
        // console.log(this.activateRoute.component)
    }
}
