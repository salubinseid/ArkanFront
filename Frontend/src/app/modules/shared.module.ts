import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { MatNativeDateModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { DataTablesModule } from 'angular-datatables';
//import { MatTableExporterModule } from 'mat-table-exporter';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

const modules = [
  FormsModule,
  MatDialogModule,
  CommonModule,
  ReactiveFormsModule,
  ToastrModule.forRoot({
    timeOut: 3500,
    positionClass: 'toast-top-left',
  }),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  }),
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatTableModule,
  DataTablesModule,
  MatTreeModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSliderModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatDividerModule,
  MatAutocompleteModule,
  MatInputModule,
  MatSortModule,
  MatProgressBarModule,
  FlexLayoutModule,
  BsDropdownModule,
  MatMenuModule,
  MatCheckboxModule,
  MatStepperModule,
  MatRadioModule,
  MatProgressSpinnerModule,
];
@NgModule({
  declarations: [],
  imports: [modules],
  exports: [modules],
})
export class SharedModule {}
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}