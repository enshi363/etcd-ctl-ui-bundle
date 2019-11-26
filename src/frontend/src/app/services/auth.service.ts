import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username :string ,password:string): Observable<any> {
    return this.http
      .post(environment.baseURI +"login", {
        user:username,
        password :password
      }, { observe: 'response' })
      .pipe(
        map(response => {
          // sessionStorage.setItem('_sid',response.headers.get('Authorization'))
          return response.body as any;
        })
      );
  }
}
