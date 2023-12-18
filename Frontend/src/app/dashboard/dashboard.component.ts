import { Component, OnInit } from '@angular/core';
import { ReportService } from '../reports/report.service';
import { StorexService } from '../Services/storex.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  reports: any = {};
  employees: any;
  flag = '';

  constructor(
    private reportService: ReportService,
    private storex: StorexService
  ) {}

  ngOnInit(): void {
    // this.reportService.getSummaryReport(null).subscribe(
    //   (res) => {
    //     // console.log(res)
    //     this.reports = res;
    //   },
    //   (error) => console.log(error)
    // );
  }
  //show customers list
  showCustomers() {
    this.flag = 'CUSTOMER';
  }

  //show Stores list
  showStores() {
    this.flag = 'STORE';
  }

  //show Items list
  showItems() {
    this.flag = 'ITEM';
  }

  //show accounts list
  showAccounts() {
    this.flag = 'ACCOUNT';
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
