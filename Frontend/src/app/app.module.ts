import { AddCountryComponent } from './components/country/add-country.component';
import { CountryComponent } from './components/country/country.component';
import { AddUnitComponent } from './components/unit/add-unit.component';
import { UnitComponent } from './components/unit/unit.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { ItemComponent } from './item/item.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerCreateComponent } from './components/customer-create/customer-create.component';
import { CheckpointComponent } from './components/checkpoint/checkpoint.component';
import { CheckpointCreateComponent } from './components/checkpoint-create/checkpoint-create.component';
import { BankComponent } from './bank/bank/bank.component';
import { BankCreateComponent } from './bank/bank-create/bank-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ToastrModule } from 'ngx-toastr';
//import { MatTableExporterModule } from 'mat-table-exporter';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
// import { ResetPasswordRequestComponent } from './auth/reset-password-request/reset-password-request.component';
// import { ResetPasswordResponseComponent } from './auth/reset-password-response/reset-password-response.component';
import { BankDetailComponent } from './bank/bank/bank-detail.component';
import { SoldComponent } from './loading/sold/sold.component';
import { DebitComponent } from './bank/debit/debit.component';
import { DebitPayComponent } from './bank/debit-pay/debit-pay.component';
import { SoldDetailComponent } from './loading/sold/sold-detail.component';
import { DebitDetailComponent } from './bank/debit/debit-detail.component';
import { CustomerDetailComponent } from './components/customer/customer-detail.component';
import { CurrencyFormatterDirective } from './directive/currency-formatter.directive';
import { DataRestComponentComponent } from './components/data-rest-component/data-rest-component.component';
import { CustomerBankDetailComponent } from './components/customer/customer-bank-detail/customer-bank-detail.component';
import { MedareshaComponent } from './components/medaresha/medaresha.component';
import { MoneyTypeComponent } from './components/money-type/money-type.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ExpenseTypeComponent } from './components/expense/expense-type.component';
import { AddExpenseComponent } from './components/expense/add-expense.component';
import { AddExpenseTypeComponent } from './components/expense/add-expense-type.component';
import { AddMoneyTypeComponent } from './components/money-type/add-money-type.component';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { IncomeExpenseComponent } from './bank/income-expense/income-expense.component';
import { AddIncomeExpenseComponent } from './bank/income-expense/add-income-expense.component';
import { TransferComponent } from './bank/transfer/transfer.component';
import { TransferCreateComponent } from './bank/transfer-create/transfer-create.component';
import { TransferDetailComponent } from './bank/transfer/transfer-detail.component';
import { AccounTransferComponent } from './bank/transfer/accoun-transfer.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { AddCompanyInfoComponent } from './components/company-info/add-company-info.component';
import { SharedModule } from './modules/shared.module';

// import { BarChartComponent } from './bar-chart/bar-chart.component';
// import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    EmployeeCreateComponent,
    ItemComponent,
    ItemCreateComponent,
    CustomerComponent,
    CustomerCreateComponent,
    CheckpointComponent,
    CheckpointCreateComponent,
    BankComponent,
    BankCreateComponent,
    DashboardComponent,
    LoginComponent,
    ChangePasswordComponent,
    BankDetailComponent,
    SoldComponent,
    DebitComponent,
    DebitPayComponent,
    SoldDetailComponent,
    DebitDetailComponent,
    CustomerDetailComponent,
    CurrencyFormatterDirective,
    DataRestComponentComponent,
    CustomerBankDetailComponent,
    MedareshaComponent,
    UnitComponent,
    CountryComponent,
    AddCountryComponent,
    ExpenseComponent,
    ExpenseTypeComponent,
    AddExpenseComponent,
    AddExpenseTypeComponent,
    MoneyTypeComponent,
    AddMoneyTypeComponent,
    AddUnitComponent,
    PasswordStrengthComponent,
    IncomeExpenseComponent,
    AddIncomeExpenseComponent,
    TransferComponent,
    TransferCreateComponent,
    TransferDetailComponent,
    AccounTransferComponent,
    CompanyInfoComponent,
    AddCompanyInfoComponent,
    // BarChartComponent,
    // LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  exports: [
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
