import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { BreadCrumbService,BreadCrumb,AuthService} from './services';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'etcd web ui';
    breads :BreadCrumb[];
    profile="";
    constructor(
        private router: Router,
        private authService:AuthService,
        private bService:BreadCrumbService
    ) {
        this.bService.GetCrumbData().subscribe(res=>{
            this.breads = res
            let p = this.authService.parseProfileString(this.authService.GetCurrentProfile())
            this.profile = p.username+"@"+p.endpoints
        })
    }
    ngOnInit():void{
    }
    switchProfile():void{
        this.authService.ClearAuth();
        this.profile = "";
        this.router.navigateByUrl("/login");
    }
}
