import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfterLoginService } from '../Services/after-login.service';
import { ReportCustomComponent } from './report-custom.component';
import { ReportSummaryComponent } from './report-summary.component';
import { ReportDailyComponent } from './report-daily.component';

const routes: Routes = [
  {
    path: '',
    component: ReportSummaryComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'summary',
    component: ReportSummaryComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'daily',
    component: ReportDailyComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'custom',
    component: ReportCustomComponent,
    canActivate: [AfterLoginService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
