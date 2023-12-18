import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { BasketRoutingModule } from './basket-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/shared/auth.interceptor';


@NgModule({
  declarations: [
    BasketComponent
  ],
  imports: [
    CommonModule,
    BasketRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule
  ],
  providers:[{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}],
})
export class BasketModule { }
