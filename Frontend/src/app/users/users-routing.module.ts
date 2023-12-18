import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfterLoginService } from '../Services/after-login.service';
import { PermissionComponent } from './permission/permission.component';
import { RoleDetailComponent } from './role/role-detail.component';
import { RoleComponent } from './role/role.component';
import { UserRoleComponent } from './role/user-role.component';

const routes: Routes = [
  {path : 'permissions', component:PermissionComponent, canActivate:[AfterLoginService]},
  {path : 'roles',component:RoleComponent, canActivate:[AfterLoginService]},
  {path : 'role-list',component:UserRoleComponent, canActivate:[AfterLoginService]},
  {path : 'roles/detail',component:RoleDetailComponent, canActivate:[AfterLoginService]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class UsersRoutingModule { }
