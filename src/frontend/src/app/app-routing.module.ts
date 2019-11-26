import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as pages from './pages';

const routes: Routes = [
  { path: 'login', component: pages.LoginComponent },
  { path: 'status', component: pages.ClusterComponent },
  { path: 'settings/role', component: pages.RoleComponent },
  { path:  '', redirectTo : 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
