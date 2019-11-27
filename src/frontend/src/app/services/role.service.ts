import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Role {
    name:string
    key:string
    endKey :string
    t:number
}
@Injectable()
export class RoleService {
    constructor(private http: HttpClient) { }
    GetList(): Observable<any> {
        return this.http
            .get(environment.baseURI+"/admin/roles", { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    GetRole(role :string): Observable<any> {
        return this.http
            .get(environment.baseURI+"/admin/role/"+role, { observe: 'response' })
            .pipe(map(response => {
                let data = response.body as any;
                data = data.permissions
                data.perm = data.perm.map((p)=>{
                    let r :Role = {
                        name:role,
                        key:atob(p.key||""),
                        endKey:atob(p.range_end||""),
                        t:p.permType
                    }
                    return r 
                })
                return data
            }));
    }
    AddRole(role:Role): Observable<any> {
        return this.http
            .post(environment.baseURI+"/admin/role",role, { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    GrantRolePermission(role:Role): Observable<any> {
        return this.http
            .put(environment.baseURI+"/admin/permission/"+role.name,role, { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    RevokeRolePermission(role:Role): Observable<any> {
        return this.http
            .post(environment.baseURI+"/admin/permission/"+role.name, role, { observe: 'response' ,headers:{"X-HTTP-Method-Override":"DELETE"}})
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    RemoveRole(role :string): Observable<any> {
        return this.http
            .delete(environment.baseURI+"/admin/role/"+role , { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
}
