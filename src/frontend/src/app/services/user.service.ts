import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
    user:string
    role:string
    password:string
}
@Injectable()
export class UserService{
    constructor(private http: HttpClient) { }
    GetList(): Observable<any> {
        return this.http
            .get(environment.baseURI+"/admin/users", { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    GetUser(username:string): Observable<any> {
        return this.http
            .get(environment.baseURI+"/admin/user/"+username, { observe: 'response' })
            .pipe(map(response => {
                let data = response.body as any;
                return data
            }));
    }
    AddUser(user:User): Observable<any> {
        return this.http
            .post(environment.baseURI+"/admin/user",user, { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    GrantUserRole(user:User): Observable<any> {
        return this.http
            .put(environment.baseURI+"/admin/user-role/"+user.user+"/"+user.role,null, { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    RevokeUserRole(user:User): Observable<any> {
        return this.http
            .delete(environment.baseURI+"/admin/user-role/"+user.user+"/"+user.role, { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    RemoveUser(username:string): Observable<any> {
        return this.http
            .delete(environment.baseURI+"/admin/user/"+username, { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
    ChangePassword(user:User): Observable<any> {
        return this.http
            .patch(environment.baseURI+"/admin/user",user, { observe: 'response' })
            .pipe(map(response => {
                return response.body as any;
            }));
    }
}
