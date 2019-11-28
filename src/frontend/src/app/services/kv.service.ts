import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class KvService{
    constructor(private http: HttpClient) { }
    GetList(prefix:string): Observable<any> {
        let params = new HttpParams() 
        params = params.append("prefix",prefix)
        return this.http
            .get(environment.baseURI+"/admin/kvs", { observe: 'response',params:params})
            .pipe(map(response => {
                let data = (response.body as any).data;
                data.kvs = data.kvs||[]
                data.kvs = data.kvs.map((p)=>{
                    return {
                        key:atob(p.key)
                    }
                })
                return data
            }));
    }
    GetK(k:string): Observable<any> {
        return this.http
            .get(environment.baseURI+"/admin/kv/"+k, { observe: 'response' })
            .pipe(map(response => {
                let data = response.body as any;
                return data
            }));
    }
    PutK(k:string,v:string,ttl:number): Observable<any> {
        return this.http
            .put(environment.baseURI+"/admin/kv",{k:k,content:v,ttl:ttl}, { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    RemoveK(k:string): Observable<any> {
        return this.http
            .delete(environment.baseURI+"/admin/kv/"+k, { observe: 'response' })
            .pipe(map(response => {
                let data = response.body as any;
                return data
            }));
    }
}

