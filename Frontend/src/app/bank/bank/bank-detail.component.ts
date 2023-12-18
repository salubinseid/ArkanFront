import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BankService } from 'src/app/Services/bank.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.css'],
})
export class BankDetailComponent implements OnInit {
  account: any;
  public filterData: string = '';
  public transfer: any;
  loading = true;
  error = '';
  totalAmount =0 ;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public displayedColumns = ['id','created_at', 'amount', 'balance', 'inOut', 'reason', 'custName'];
  public dataSource = new MatTableDataSource<any>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private bankService: BankService,
    private toastr: ToastrService,
    private storex: StorexService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      let results: any;
      this.bankService.getAccouctDetail(id).subscribe(
        (res) => {
          results = res;
          this.account = results.account;
          // this.addBalanceAfterEachTransaction(this.dataSource.data);
          // this.dataSource.data = results.transactions;

          this.calculateTotal(results.transactions)
          this.loading = false;
          this.toastr.success(
            this.account.bankName + 'Account detail is loaded',
            'Account Deatil'
          );
        },
        (err) => {
          this.error = err.error;
          this.loading = false;
          this.toastr.error('Account detail NOT loaded', 'Account Deatil');
        }
      );
    });
  }

  // addBalanceAfterEachTransaction = (transfers) => {
  //   let balance = 0;
  //   transfers.map((t)=>{
  //     val.inOut === "ገቢ" || val.inOut === "የተለያየ ገቢ"?    +=val.amount : this.totalAmount-=val.amount;
  //      console.log(t);

  //   })
  // }

  calculateTotal(res:any){
    this.totalAmount = 0  ;
    res.map((val:any)=>{
      val.inOut === "ገቢ" || val.inOut === "የተለያየ ገቢ"?    this.totalAmount+=val.amount : this.totalAmount-=val.amount;
      val.balance =  this.totalAmount;
    })
    this.dataSource.data = res;
  }
  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
