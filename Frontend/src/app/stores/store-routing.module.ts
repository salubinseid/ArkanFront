import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { AfterLoginService } from '../Services/after-login.service';
import { StoreCreateComponent } from './store-create/store-create.component';
import { StoreDetailComponent } from './store-detail.component';
import { StoreItemListComponent } from './store/store-item-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { StoreItemsComponent } from './store-items/store-items.component';
import { StoreItemsDetailComponent } from './store-items/store-items-detail.component';

const routes: Routes = [
  {
    path: '',
    component: StoreComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'create',
    component: StoreCreateComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'detail',
    component: StoreDetailComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'item/detail',
    component: StoreItemListComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'items/create',
    component: AddItemComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'items',
    component: StoreItemsComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'items/detail',
    component: StoreItemsDetailComponent,
    canActivate: [AfterLoginService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
