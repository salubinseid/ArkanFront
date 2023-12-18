import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BankService } from 'src/app/Services/bank.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { DebitPayComponent } from '../debit-pay/debit-pay.component';

@Component({
  selector: 'app-debit',
  templateUrl: './debit.component.html',
  styleUrls: ['./debit.component.css']
})
export class DebitComponent implements OnInit {

  loading: boolean = true;
  error=''
  loads: any;
  price: number = 0;
  editMode: boolean = false;
  status: string = '';
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns =
    ['SNo', 'custName', 'totalPrice', 'paidAmount', 'remainAmount', 'created_at', 'actions'];

  // ['itemName','quantity','salesPrice','totalPrice','paidAmount','remainAmount','custName',
  // 'created_at','actions'];
  public dataSource = new MatTableDataSource<any>();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  editStatus(id: number) {
    this.editMode = !this.editMode;
  }

  updateStatus() {
    console.log(this.status)
  }

  constructor(
    private shared: SharedService,
    private storex: StorexService,
    private router: Router,
    private bankService: BankService
  ) { }

  ngOnInit(): void {
    this.getAllDebit();
  }

  openDialog(data: any) {
    this.shared.openDialog(DebitPayComponent, this.getAllDebit,{ height: '550px', width: '650px', data: data })
  }

  getAllDebit = () => {
    this.bankService.getAllDebit().subscribe(result => {
      this.dataSource.data = result.data;
      this.loading = false;
    },
      error => {
        this.error=error.error;
        this.loading = false;
      })
  }

  viewDetail(id: any) {
    this.router.navigate(['debits/detail', { id: id }]);
  }

  deleteRecord(id: any) {

  }


  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }

}
