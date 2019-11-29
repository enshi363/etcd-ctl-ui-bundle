import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface KVS{
    name:string
    type:number
}

@Injectable()
export class KvService{
    constructor(private http: HttpClient) { }
    GetList(prefix:string): Observable<any> {
        let params = new HttpParams() 
        params = params.append("prefix",prefix)
        return this.http
            .get(environment.baseURI+"/admin/kvs", { observe: 'response',params:params})
            .pipe(map(response => {
                let body = response.body as any;
                let data = body.data as any[];
                return data.sort((a,b)=>{
                    return b.charAt(b.length-1)=="/"?1:-1
                }).map(k=>{
                    let b:KVS = {
                        name:k,
                        type:k.charAt(k.length-1)=="/"?1:0
                    }
                    return b
                }) 
            }));
    }
    GetK(k:string): Observable<any> {
        return this.http
            .get(environment.baseURI+"/admin/kv/"+k, { observe: 'response' })
            .pipe(map(response => {
                const body = response.body as any;
                let data = body.data
                let kv = {
                    value:"",
                    version:0
                }
                if (data.kvs&&data.kvs.length>0){
                    kv.value = atob(data.kvs[0].value)
                    kv.version = data.kvs[0].version
                }
                return kv; 
            }));
    }
    PutK(k:string,v:string,ttl:number): Observable<any> {
        return this.http
            .put(environment.baseURI+"/admin/kv",{Key:k,content:v,ttl:ttl}, { observe: 'response' })
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

