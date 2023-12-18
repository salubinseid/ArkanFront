import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportSummaryComponent } from './report-summary.component';
import { ReportDetailComponent } from './report-detail.component';
import { ReportCustomComponent } from './report-custom.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ReportDailyComponent } from './report-daily.component';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    ReportSummaryComponent,
    ReportDetailComponent,
    ReportCustomComponent,
    ReportDailyComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    MatButtonModule,
    MatSelectModule,
    DataTablesModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ReportModule {}
