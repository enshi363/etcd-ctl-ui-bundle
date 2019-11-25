import {Injectable} from '@angular/core';
import {Observable , throwError} from 'rxjs';
import { catchError,map, switchMap } from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpErrorResponse,JsonpClientBackend,HttpResponse} from '@angular/common/http';

@Injectable()
export class HttpInterCeptor implements HttpInterceptor {
  _credential : string;
  jsonp;
  redirected = false;
  constructor (private activatedRoute: ActivatedRoute,private _message:NzMessageService,private router:Router,jsonp:JsonpClientBackend){
    // console.log('aa')
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this._credential = sessionStorage.getItem('_credential')||'';
    let params = req.params;
    let url = req.params.keys().reduce((carry,k)=> {
      carry = carry.replace(k, req.params.get(k));
      if ((/^@.+/g).test(k) == true) {
        params = params.delete(k);
      }
      return carry;
    }, req.url).replace(/\/@.+/, '');
    const authReq = req.clone({url, headers: req.headers.set('Authorization', this._credential), params, withCredentials: true});
    return next.handle(authReq).pipe(catchError((error: HttpErrorResponse) => {
      if ((error.status === 401 || error.status === 403) && this.redirected === false) {
        this.redirected = true;
        
        this.router.navigate(['/login']);
      }
      return throwError(error);
    })).pipe(map((resp: HttpResponse<HttpEvent<any>>) => {
       this.redirected = false;
       if (typeof resp.headers !== 'undefined' && resp.headers.get('Authorization') !== '' && resp.headers.get('Authorization') != null) {
        sessionStorage.setItem('_credential', resp.headers.get('Authorization'));
      }
       return resp;
    }));

  }
}
