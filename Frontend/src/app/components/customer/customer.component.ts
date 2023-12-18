import { SharedService } from 'src/app/Services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from 'src/app/Services/customer.service';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';
import { Router } from '@angular/router';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  loading: boolean = true;
  error = '';
  customers: any;
  customer: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'sno',
    'custName',
    'phone',
    'debit',
    'email',
    'address',
    'fullName',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();
  totalDebit: number = 0;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
    this.calaculateTotal(this.dataSource.filteredData);
  }

  constructor(
    private custService: CustomerService,
    private shared: SharedService,
    private storex: StorexService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers = () => {
    this.custService.getAllCustomers().subscribe(
      (result) => {
        this.dataSource.data = result;
        this.calaculateTotal(this.dataSource.data);

        this.loading = false;
      },
      (error) => {
        this.error = error.error;
        this.loading = false;
      }
    );
  };

  openDialog() {
    this.shared.openDialog(CustomerCreateComponent, this.getAllCustomers, {
      height: '450px',
      width: '500px',
    });
  }
  openDialogForEdit(data: any) {
    this.shared.openDialog(CustomerCreateComponent, this.getAllCustomers, {
      height: '450px',
      width: '500px',
      data,
    });
  }

  //get single customer account information
  public getCustomer = (id: number) => {
    this.custService.getCustomer(id).subscribe(
      (res) => {
        this.customer = res;
      },
      (error) => console.log(error)
    );
  };
  public viewDetail(id: number) {
    this.router.navigate(['customers/detail', { id: id }]);
  }
  public viewCustomerBankDetail(id: number) {
    this.router.navigate(['customers/bank_detail', { id: id }]);
  }

  public updateRecord = (data: any) => {
    // this.getCustomer(id);
    this.openDialogForEdit(data);
  };

  //delete customer record
  public deleteRecord = (data: any) => {
    // this.getCustomer(data.id);

    if (
      confirm(
        'የ' +
          data.custName +
          ' ' +
          data.accountNumber +
          ' የሒሳብ ቁጥሩን መሰረዝ ትፈልጋለህ?'
      )
    ) {
      this.custService.deleteCustomer(data.id).subscribe(
        (res) => {
          this.toastr.success(
            'የ' +
              data.customerName +
              ' ባንክ ' +
              data.accountNumber +
              ' የCustomer በትክክል ተሰርዟል፡፡',
            'በትክክል መሰረዝ'
          );
          this.getAllCustomers();
        },
        (error) => {
          this.toastr.error('የሒሳብ ቁጥሩ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  calaculateTotal(res:any){
    this.totalDebit = 0;

    res.map((val:any)=>{
      this.totalDebit+=val.debit;
    })
  }


  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
