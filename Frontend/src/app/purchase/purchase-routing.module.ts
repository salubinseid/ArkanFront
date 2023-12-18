import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesComponent } from './purchases.component';
import { AfterLoginService } from '../Services/after-login.service';
import { PurchaseDetailComponent } from './purchase-detail.component';

const routes: Routes = [
  { path: '', component: PurchasesComponent, canActivate: [AfterLoginService] },
  {
    path: 'detail',
    component: PurchaseDetailComponent,
    canActivate: [AfterLoginService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {}
