import { MoneyTypeComponent } from './components/money-type/money-type.component';
import { CountryComponent } from './components/country/country.component';
import { UnitComponent } from './components/unit/unit.component';
import { ExpenseTypeComponent } from './components/expense/expense-type.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { EmployeeComponent } from './employee/employee.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { ItemComponent } from './item/item.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerCreateComponent } from './components/customer-create/customer-create.component';
import { CheckpointComponent } from './components/checkpoint/checkpoint.component';
import { CheckpointCreateComponent } from './components/checkpoint-create/checkpoint-create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { AfterLoginService } from './Services/after-login.service';
import { TransferComponent } from './bank/transfer/transfer.component';
import { TransferCreateComponent } from './bank/transfer-create/transfer-create.component';
import { BasketModule } from './components/basket/basket.module';
import { TransferDetailComponent } from './bank/transfer/transfer-detail.component';
import { SoldComponent } from './loading/sold/sold.component';
import { DebitComponent } from './bank/debit/debit.component';
import { SoldDetailComponent } from './loading/sold/sold-detail.component';
import { DebitDetailComponent } from './bank/debit/debit-detail.component';
import { UsersModule } from './users/users.module';
import { ReportModule } from './reports/report.module';
import { CustomerDetailComponent } from './components/customer/customer-detail.component';
import { CustomerBankDetailComponent } from './components/customer/customer-bank-detail/customer-bank-detail.component';
import { IncomeExpenseComponent } from './bank/income-expense/income-expense.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'logout',
    component: LoginComponent,
    canActivate: [AfterLoginService],
  },
  // { path:'',component:EmployeeComponent},
  {
    path: 'employees',
    component: EmployeeComponent,
    canActivate: [AfterLoginService],
    //, RoleGuard],data: {   expectedRoles:['admin','auditor']}
  },
  {
    path: 'employees/create',
    component: EmployeeCreateComponent,
    canActivate: [AfterLoginService],
    //data: { expectedRoles:['admin','auditor']  }
  },

  // { path:'test', component:TestComponent, canActivate:[AfterLoginService]},

  { path: 'items', component: ItemComponent, canActivate: [AfterLoginService] },
  {
    path: 'items/create',
    component: ItemCreateComponent,
    canActivate: [AfterLoginService],
  },

  {
    path: 'customers',
    component: CustomerComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'customers/create',
    component: CustomerCreateComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'customers/detail',
    component: CustomerDetailComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'customers/bank_detail',
    component: CustomerBankDetailComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'checkpoints',
    component: CheckpointComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'checkpoints/create',
    component: CheckpointCreateComponent,
    canActivate: [AfterLoginService],
  },

  {
    path: 'sales/sold',
    component: SoldComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'sales/detail',
    component: SoldDetailComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'debits',
    component: DebitComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'debits/detail',
    component: DebitDetailComponent,
    canActivate: [AfterLoginService],
  },

  {
    path: 'transfers',
    component: TransferComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'transfers/create',
    component: TransferCreateComponent,
    canActivate: [AfterLoginService],
  },
  {
    path: 'transfers/detail',
    component: TransferDetailComponent,
    canActivate: [AfterLoginService],
  },

  {
    path: 'expenses',
    component: ExpenseComponent,
  },
  {
    path: 'expenseTypes',
    component: ExpenseTypeComponent,
  },
  {
    path: 'incomeExpenseTypes',
    component: IncomeExpenseComponent,
  },
  {
    path: 'units',
    component: UnitComponent,
  },
  {
    path: 'countries',
    component: CountryComponent,
  },
  {
    path: 'moneyTypes',
    component: MoneyTypeComponent,
  },

  { path: 'dashboard', component: DashboardComponent },

  //applying here the lazy loading
  {
    path: 'basket',
    loadChildren: () =>
      import('./components/basket/basket.module').then((b) => BasketModule),
  },

  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then((u) => UsersModule),
  },

  {
    path: 'report',
    loadChildren: () =>
      import('./reports/report.module').then((u) => ReportModule),
  },
  {
    path: 'purchases',
    loadChildren: () =>
      import('./purchase/purchase.module').then((r) => r.PurchaseModule),
  },
  {
    path: 'loads',
    loadChildren: () =>
      import('./loading/load.module').then((m) => m.LoadModule),
  },
  {
    path: 'stores',
    loadChildren: () =>
      import('./stores/store.module').then((m) => m.StoreModule),
  },
  {
    path: 'companyInfo',
    component: CompanyInfoComponent,
    canActivate: [AfterLoginService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
