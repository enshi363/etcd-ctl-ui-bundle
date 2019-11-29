import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as pages from './pages';

const routes: Routes = [
  { path: 'login', component: pages.LoginComponent },
  { path: 'status', component: pages.ClusterComponent },
  { path: 'settings/role', component: pages.RoleComponent },
  { path:  'settings/role/', redirectTo : 'settings/role', pathMatch: 'full'},
  { path:  'settings/user/', redirectTo : 'settings/user', pathMatch: 'full'},
  { path:  'KVs/', redirectTo : 'KVs', pathMatch: 'full'},
  { path: 'settings/user', component: pages.UserComponent},
  { path: 'KVs', component: pages.KvComponent},
  { path: 'settings/role', component: pages.RoleComponent },
  { path:  '', redirectTo : 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
