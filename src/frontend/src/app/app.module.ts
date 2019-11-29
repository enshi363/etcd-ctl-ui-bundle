import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS,HttpClientJsonpModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpInterCeptor } from './HttpInterceptor';
import * as pages from './pages';

import * as services from './services'
// import { ClusterService } from './services/cluster.service'

registerLocaleData(zh);

const PageComponents = (()=>{
  let p = []
  for (let k in pages){
    p.push(pages[k])
  }
  return p;
})()

const MyServices= (()=>{
  let s = []
  for (let k in services){
    s.push(services[k])
  }
  return s;
})()

@NgModule({
  declarations: [
    AppComponent,
    // pages.ClusterComponent,
    // pages.RoleComponent,
    // pages.RoleEditComponent,
    // pages.UserComponent,
    // pages.UserDetailComponent,
    // pages.KvComponent,
    // pages.LoginComponent
    ...PageComponents
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterCeptor,
      multi: true,
    },
    ...MyServices 
  ],
  entryComponents:[
    pages.RoleEditComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
