import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/Services/customer.service';
import { LoadService } from 'src/app/Services/load.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-customer-bank-detail',
  templateUrl: './customer-bank-detail.component.html',
  styleUrls: ['./customer-bank-detail.component.css'],
})
export class CustomerBankDetailComponent implements OnInit {
  payments: any;
  customer: any;
  public filterData: string = '';
  public transfer: any;
  loading = true;
  error = '';

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public displayedColumns = [
    'id',
    'created_at',
    'amount',
    'accountNumber',
    'bankName',
    'inOut',
    'reason',
  ];

  public dataSource = new MatTableDataSource<any>();
  totalPaidAmount: number = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private storex: StorexService,
    private toaster: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }
  ngOnInit(): void {
    this.loadCustomerPaymentDetail();
  }

  loadCustomerPaymentDetail() {
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      let results: any;
      this.customerService.getCustomerPaymentDetail(id).subscribe(
        (res) => {
          results = res;
          this.customer = results.customer;
          this.dataSource.data = results.payments;
          this.calaculateTotalPaid(results.payments)
          this.loading = false;
          this.toaster.success(
            this.customer.custName + ' Customer payment detail is loaded',
            'Customer payment Deatil'
          );
        },
        (err) => {
          this.error = err.error;
          this.loading = false;
          this.toaster.error(
            'Customer payment detail NOT loaded',
            'Customer Deatil'
          );
        }
      );
    });
  }

  calaculateTotalPaid(res:any){
    this.totalPaidAmount = 0;

    res.map((val:any)=>{
      this.totalPaidAmount+= val.amount ? val.amount : 0;
    })
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
