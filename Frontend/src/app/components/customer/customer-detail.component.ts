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
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
})
export class CustomerDetailComponent implements OnInit {
  customer: any;
  payments: any;
  public filterData: string = '';
  public transfer: any;
  loading = true;
  selected:any;
  error = '';
  totalLoadingCost = 0;
  totalSaleCost = 0;
  editMode = false;
  tcEditMode = false;
  rmEditMode = false;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort2!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator2!: MatPaginator;

  public dataSource1 = new MatTableDataSource<any>();
  public dataSource2 = new MatTableDataSource<any>();

  public displayedColumns = [
    'id',
    'updated_at',
    'plateNum',
    'itemName',
    'unitName',
    'itemQty',
    'itemPrice',
    'loadingQty',
    'loadingPrice',
    'driverLoan',
    'otherExpense',
    'totalPrice',
    'totatlTransport',
    // 'net',
    'orderFrom',
    'transportRemark',
  ];
  public displayedColumns1 = [
    'id',
    'created_at',
    'amount',
    'accountNumber',
    'bankName',
    'inOut',
    'reason',
  ];
  totalOtherExpense: number = 0;
  totalDriverLoan: number = 0;
  totalPrice: number = 0 ;
  totalTransportCost: number = 0;
  totalItem: number = 0;
  grandTotal: number = 0;
  totalPaidAmount: number = 0;
  closedBalanceStatus = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private storex: StorexService,
    private loadService: LoadService,
    private toaster: ToastrService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource1.sort = this.sort;
    this.dataSource1.paginator = this.paginator;

    this.dataSource2.sort = this.sort2;
    this.dataSource2.paginator = this.paginator2;
  }
  public doFilter() {
    this.dataSource1.filter = this.filterData.trim().toLocaleLowerCase();
    this.calaculateTotal(this.dataSource1.filteredData)
  }
  ngOnInit(): void {
    this.loadDetail();
  }

  loadDetail() {
    this.getLoadDetail(false);
  }
  showClosedBalance = () => {
    // this.closedBalanceStatus = !this.closedBalanceStatus
    console.log("Is Closed :",this.closedBalanceStatus)
    if(this.closedBalanceStatus)
    {
      this.getLoadDetail(true);
    }
    else{
      this.getLoadDetail(false);
    }
  }

  getLoadDetail(includedClosed:boolean){
    this.totalLoadingCost=0;
    this.totalSaleCost = 0;
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      let results: any;
      this.customerService.getCustomerDetail(id,includedClosed).subscribe(
        (res) => {
          results = res;
          this.customer = results.customer;
          // this.payments = results.payments;
          let allSolds= results.soldsFromStore.concat(results.soldsFromTruck);

          this.dataSource1.data = allSolds;
          // this.dataSource2.data = results.payments;

          this.calaculateTotal(allSolds)
          // this.calaculateTotalPaid(results.payments)
          this.loading = false;
          this.toaster.success(
            this.customer.custName + ' Customer detail is loaded',
            'Customer Deatil'
          );
        },
        (err) => {
          this.error = err.error;
          this.loading = false;
          this.toaster.error('Customer detail NOT loaded', 'Customer Deatil');
        }
      );
    });
  }

  calaculateTotal(res:any){
    this.totalOtherExpense = 0;
    this. totalDriverLoan=0;
    this.totalPrice = 0  ;
    this.totalTransportCost = 0  ;
    this.totalItem = 0;

    res.map((val:any)=>{
      this.totalDriverLoan+= val.driverLoan ? val.driverLoan : 0;
      this.totalOtherExpense+= val.otherExpense ? val.otherExpense : 0;
      this.totalPrice+=(val.itemPrice * val.itemQty);
      this.totalItem+=val.itemQty;
      this.totalTransportCost += ((val.loadingQty ? val.loadingQty : 0) * (val.loadingPrice ? val.loadingPrice : 0 ));
      this.grandTotal = this.totalPrice - this.totalTransportCost + this.totalDriverLoan - this.totalOtherExpense;
    })
    console.log('Tota transport ',this.totalTransportCost)
  }

  calaculateTotalPaid(res:any){
    this.totalPaidAmount = 0;

    res.map((val:any)=>{
      // this.totalPaidAmount+= val.amount ? val.amount : 0;
      val.inOut === "ገቢ" ?    this.totalPaidAmount+=val.amount : this.totalPaidAmount-=val.amount;

    })
  }


  changeUnitItemPrice(id: number) {
    this.selected = id;
    this.editMode = !this.editMode;
    console.log(this.editMode);
  }
  //update unit sales price of single item
  updateUnitItemPrice(id: number, event: any) {
    const price = event.target.value;
    const formData = new FormData();
    formData.append('salesPrice', price);
    this.loadService.updateUnitPriceAfterSold(id, formData).subscribe(
      (res: any) => {
        console.log(res);
        this.totalLoadingCost = 0;
        this.totalSaleCost =0;
        this.loadDetail();
        this.toaster.success(res.msg, res.title);
        this.editMode = false;
      },
      (err) => {
        console.log(err);
        this.toaster.error(err.msg, err.title);
        this.editMode = false;
      }
    );
  }

  changeUnitItemTransportCost(id: number) {
    this.selected.id=id;
    this.tcEditMode = !this.tcEditMode;
  }
  //update unit sales price of single item
  updateUnitItemTransportCost(id: number, event: any) {
    const price = event.target.value;
    const formData = new FormData();
    formData.append('unitTariff', price);
    this.loadService.updateTransportUnitPriceAfterSold(id, formData).subscribe(
      (res: any) => {
        this.loadDetail();
        this.toaster.success(res.msg, res.title);
        this.tcEditMode = false;
      },
      (err) => {
        this.toaster.error(err.msg, err.title);
        this.tcEditMode = false;
      }
    );
  }

  changeAddRemark(id: number) {
    console.log(id);
    this.selected=id;
    this.rmEditMode = !this.rmEditMode;
  }
  //add remark for each load
  addRemark(id: number, event: any) {
    const remark = event.target.value;
    const formData = new FormData();
    console.log(remark)
    formData.append('remark', remark);
    this.loadService.addRemark(id, formData).subscribe(
      (res: any) => {
        this.loadDetail();
        this.toaster.success(res.msg, res.title);
        this.rmEditMode = false;
      },
      (err) => {
        this.toaster.error(err.msg, err.title);
        this.rmEditMode = false;
      }
    );
  }

  closeCustomerBalnace = (id:number) => {
    let result:any;
    if(confirm("የደንበኛው ሒሳብ እየዘጋህ ነው፡፡ ከተዘጋ በኋላ ሒሳቡን ማየት አትችልም፡፡ ሒሳቡን መዝጋት እርግጠኛ ነህ?"))
    {
        this.customerService.closeBalance(id).subscribe((res)=>{
        result= res;
        this.toaster.success(result.message,result.title);
        this.loadDetail();
      },
      (error)=>{
        this.toaster.error(result.message,result.title);
      })
    }
  }



  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
