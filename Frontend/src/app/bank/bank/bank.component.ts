import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { BankService } from 'src/app/Services/bank.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from 'src/app/Services/shared.service';
import { BankCreateComponent } from '../bank-create/bank-create.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StorexService } from 'src/app/Services/storex.service';
import { AccounTransferComponent } from '../transfer/accoun-transfer.component';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit, AfterViewInit  {

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false }) paginator!: MatPaginator;

  public filterData:string='';
  public displayedColumns =
  ['SNo','created_at','accountNumber', 'accountOwner', 'bankName', 'branchName', 'balance','country', 'actions'];
  public dataSource = new MatTableDataSource<any>();
  loading=true;
  error='';
  bank:any;
  transactions:any;
  totalBalance: number = 0;
  banks:any;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter(){
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
    this.calculateTotalBalance(this.dataSource.filteredData);
  }

  constructor(
      private bankService: BankService, private storex:StorexService,
      private toastr:ToastrService,
      private router:Router, private shared:SharedService
     )
     { }

  ngOnInit() {
    this.getAllBanks();

  }


  openDialog() {
    this.shared.openDialog(BankCreateComponent,this.getAllBanks,{height:'400px', width:'700px'});
    }
    openDialogForEdit(data:any) {
      this.shared.openDialog(BankCreateComponent,this.getAllBanks,{height:'400px', width:'700px',data});
      }


  public getAllBanks = () => {
    this.bankService.getAllBanks()
    .subscribe(res => {
      this.dataSource.data = res
      this.calculateTotalBalance(res);
      this.loading=false;

    },
    (error)=>{
      console.log(error);

      this.error = error.error;
      this.loading=false;

    })
  }

  calculateTotalBalance = (res:any)=>{
    this.totalBalance = 0;
    res.map((val:any)=>{
      this.totalBalance+= val.balance;
    })
  }

  //get single bank account information
  public getBank = (id:number) =>{
    this.bankService.getBank(id).subscribe(res=>{
      this.bank = res;
    },
    error=> console.log(error))
  }
  public viewDetail = (id: number) => {
    this.router.navigate(['banks/detail',{id:id}]);
  }

  public updateRecord = (data: any) => {
    // this.getBank(id);
    this.openDialogForEdit(data);
  }

  //delete bank record
  public deleteRecord = (data: any) => {
    // this.getBank(data.id);

    if(confirm('የ' + data.bankName + ' ' + data.accountNumber + " የሒሳብ ቁጥሩን መሰረዝ ትፈልጋለህ?")) {
      this.bankService.deleteBank(data.id).subscribe((res:any)=>{
        this.toastr.success( 'የ' + this.bank.bankName + ' ባንክ ' +this.bank.accountNumber +
        " የሒሳብ ቁጥር በትክክል ተሰርዟል፡፡","በትክክል መሰረዝ");
        this.getAllBanks();
      },
      (error : any) => {
        this.toastr.error("የሒሳብ ቁጥሩ አልሰረዘም፡","ያልተሳካ መሰረዝ")

      });
    }
  }

  accountResetAll(){
      if(confirm("የሁሉንም አካወንቶች ሒሳብ ባላንስ ዜሮ ማድረግ ትፈልጋለህ?")) {
        this.bankService.resetBankAll().subscribe((res: any)=>{
          this.toastr.success( "የሁሉም አካውንት ሒሳብ ባላንስ ዜሮ በትክክል ሆኗል፡፡","የተሳካ ሂደት");
          this.getAllBanks();
        },
        (error : any) => {
          this.toastr.error("የሁሉም አካውንት ሒሳብ ባላንስ ዜሮ አልሆነም፡፡","ያልተሳካ ሙከራ")

        });
      }
  }
  openTransferDialog(){
    this.shared.openDialog(AccounTransferComponent,this.getAllBanks,
      { height: '460px', width: '550px' })
  }

  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }
}
