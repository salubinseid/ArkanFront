import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { SharedModule } from '../modules/shared.module';
import { StoreComponent } from './store/store.component';
import { StoreCreateComponent } from './store-create/store-create.component';
import { StoreItemListComponent } from './store/store-item-list.component';
import { StoreDetailComponent } from './store-detail.component';
import { StoreItemsDetailComponent } from './store-items/store-items-detail.component';
import { AddItemComponent } from './add-item/add-item.component';
import { StoreItemsComponent } from './store-items/store-items.component';
import { TransferItemsComponent } from './store-items/transfer-items.component';

@NgModule({
  declarations: [
    StoreComponent,
    StoreCreateComponent,
    StoreItemListComponent,
    StoreDetailComponent,
    StoreItemsDetailComponent,
    AddItemComponent,
    StoreItemsComponent,
    TransferItemsComponent,
  ],
  imports: [CommonModule, StoreRoutingModule,SharedModule],
})
export class StoreModule {}
