import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { SharedModule } from '../modules/shared.module';
import { PurchasesComponent } from './purchases.component';
import { AddPurchaseItemComponent } from './add-purchase-item.component';
import { PurchaseDetailComponent } from './purchase-detail.component';
import { UpdatePurchaseItemComponent } from './update-purchase-item.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    PurchasesComponent,
    AddPurchaseItemComponent,
    PurchaseDetailComponent,
    UpdatePurchaseItemComponent,
  ],
  imports: [
    CommonModule,
    
    ReactiveFormsModule,
    PurchaseRoutingModule,
    SharedModule,
  ],
})
export class PurchaseModule {}
