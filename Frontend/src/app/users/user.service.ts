import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  //fetch all permission for system admin
  getAllPermissions() {
    return this.http.get<any>(environment.baseURL + '/users/permissions')
  }

  //get unassigned permission
  getUnassignedPermissions(id:any){
    return this.http.get<any>(environment.baseURL + '/users/roles/unassigned-permissions/'+id )
  }
  //recording new permission type
  addPermission(data: any) {
    return this.http.post(environment.baseURL + '/users/permissions', data);
  }
  //recording new permission type
  updatePermission(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/users/permissions/' + id, data);
  }

  //get a single permissin info
  getPermission(id: number) {
    return this.http.get(environment.baseURL + '/users/permissions/' + id);
  }

  //delete permission record
  deletePermission(id: number) {
    return this.http.delete<any>(environment.baseURL + '/users/permissions/' + id);
  }


  //=============================================================================
  /**Role related operations */
  //fetch all Role for system admin
  getAllRoles() {
    return this.http.get<any>(environment.baseURL + '/users/roles')
  }
  
  //get role with list of its permiossnon
  getRoleDetail(id:any){
    return this.http.get<any>(environment.baseURL + '/users/roles/detail/'+id);
  }

  //recording new Role type
  addRole(data: any) {
    return this.http.post(environment.baseURL + '/users/roles', data);
  }
  //recording new Role type
  updateRole(data: any, id: number) {
    return this.http.put<any>(environment.baseURL + '/users/roles/' + id, data);
  }

  //get a single permissin info
  getRole(id: number) {
    return this.http.get(environment.baseURL + '/users/roles/' + id);
  }

  //delete Role record
  deleteRole(id: number) {
    return this.http.delete<any>(environment.baseURL + '/users/roles/' + id);
  }
  //get all users with their role list
getAllUsersWithRoles(){
  return this.http.get<any>(environment.baseURL + '/users/role-list')
}

  //get role list names
  getRoleNames() {
    return this.http.get<any>(environment.baseURL + '/users/roles')
  }

  //assign role for specifi User
  assignEmployeeRole(data: any) {
    return this.http.post(environment.baseURL + '/users/roles/assign', data);
  }


  //delere permissions from Role
  deletePermissionFromRole(rid:number, pid:number){
    return this.http.delete(environment.baseURL+'/users/roles/'+rid +'/permission/'+pid);
  }

  //delete user role
  deleteUserRole(uid:number, rid:number){
    return this.http.delete(environment.baseURL+'/users/user/'+uid +'/role/'+rid);
  }
  //==================================================================================

}
