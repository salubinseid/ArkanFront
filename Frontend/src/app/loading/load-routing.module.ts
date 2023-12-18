import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadComponent } from './load/load.component';
import { AfterLoginService } from '../Services/after-login.service';
import { LoadCreateComponent } from './load-create/load-create.component';
import { LoadDetailComponent } from './load-detail/load-detail.component';

const routes: Routes = [
  { path: '', component: LoadComponent, canActivate: [AfterLoginService] },
  {
    path: 'create',
    component: LoadCreateComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'detail',
    component: LoadDetailComponent,
    canActivate: [AfterLoginService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadRoutingModule {}
