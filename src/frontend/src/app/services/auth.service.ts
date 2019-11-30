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

export interface Profile{
  endpoints:string
  username:string
  password:string
}

@Injectable()
export class AuthService {
  private prefix ="profile#"
  constructor(private http: HttpClient) {}

  login(profileString:string): Observable<any> {
    const profile = this.parseProfileString(profileString)
    return this.http
      .post(environment.baseURI +"/login", {
        endpoints:profile.endpoints.split(","),
        user:profile.username,
        password :profile.password
      }, { observe: 'response' })
      .pipe(
        map(response => {
          this.SaveProfile(profileString)
          return response.body as any;
        })
      );
  }

  // parse profile string from user:password@endpoint,endpoint2 
  parseProfileString(profileString:string):Profile{
    let profile :Profile = {endpoints:"",username:"",password:""};
    if (profileString.indexOf("@")==-1){
      profile.endpoints = profileString
      return profile;
    }
    const p = profileString.split("@");
    profile.endpoints = p[1];
    if (p[0].indexOf(":")==-1){
      profile.username= p[0]
    }else{
      let user = p[0].split(":")
      profile.username = user[0]
      profile.password = user[1]
    }
    return profile
  }

  GetCurrentProfile():string{
    for(let i:number=0;i<localStorage.length;i++){
      let key = localStorage.key(i)
      if (key.indexOf(this.prefix)==0){
        if (localStorage.getItem(key)=="1"){
          return key;
        }
      }
    }
  }

  SaveProfile(p:string){
    for(let i:number=0;i<localStorage.length;i++){
      let key = localStorage.key(i)
      if (key.indexOf(this.prefix)==0){
        localStorage.setItem(key,"0")
      }
    }
    localStorage.setItem(this.prefix+p,"1")
  }

  RemoveProfile(p:string){
    localStorage.removeItem(this.prefix+p)
  }

  ClearAuth(){
    sessionStorage.removeItem("_credential")
  }

  GetProfiles() :string[]{
    let profiles :string[] = []
    for(let i:number=0;i<localStorage.length;i++){
      let key = localStorage.key(i)
      if (key.indexOf(this.prefix)==0){
        profiles.push(key.replace(this.prefix,"")) 
      }
    }
    return profiles
  }

}
