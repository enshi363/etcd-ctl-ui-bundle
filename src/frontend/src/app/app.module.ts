import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpInterCeptor } from './HttpInterceptor';
import { LoginComponent } from './pages/login.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterCeptor,
      multi: true,
    },
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
