import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BreadCrumb {
    name:string
    icon:string
    url:string
    param:any
}

@Injectable({
    providedIn: 'root',
}
)
export class BreadCrumbService {
    private BreadCrumbData = new Subject<BreadCrumb[]>();
    constructor() { 
    }
    GetCrumbData():Observable<BreadCrumb[]> {
        return this.BreadCrumbData
    }
    BroadCastData(b:BreadCrumb[]):void{
        this.BreadCrumbData.next(b)
    }
    
}