import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable()
export class ClusterService {
    constructor(private http: HttpClient) { }
    status(): Observable<any> {
        return this.http
            .get( environment.baseURI+ "/admin/cluster/status", { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
}
