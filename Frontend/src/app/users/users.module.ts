import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { RoleComponent } from './role/role.component';
import { RoleCreateComponent } from './role/role-create.component';
import { RoleAssignComponent } from './role/role-assign.component';
import { PermissionComponent } from './permission/permission.component';
import { PermissionCreateComponent } from './permission/permission-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { UserRoleComponent } from './role/user-role.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../shared/auth.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { RoleDetailComponent } from './role/role-detail.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    RoleComponent,
    RoleCreateComponent,
    RoleAssignComponent,
    PermissionComponent,
    PermissionCreateComponent,
    UserRoleComponent,
    RoleDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatDialogModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class UsersModule {}
