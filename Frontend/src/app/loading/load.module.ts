import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadRoutingModule } from './load-routing.module';
import { SharedModule } from '../modules/shared.module';
import { LoadComponent } from './load/load.component';
import { UnloadComponent } from './unload/unload.component';
import { LoadCreateComponent } from './load-create/load-create.component';
import { LoadDetailComponent } from './load-detail/load-detail.component';

@NgModule({
  declarations: [
    LoadComponent,
    LoadCreateComponent,
    UnloadComponent,
    LoadDetailComponent,
  ],
  imports: [CommonModule, LoadRoutingModule, SharedModule],
})
export class LoadModule {}
