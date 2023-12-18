import { ItemService } from './../../Services/item.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadService } from 'src/app/Services/load.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-sold-detail',
  templateUrl: './sold-detail.component.html',
  styleUrls: ['./sold-detail.component.css']
})
export class SoldDetailComponent implements OnInit {

  info: any;
  public filterData: string = '';
  public transfer: any;
  ON_STORE="ከመጋዘን";

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public displayedColumns =
    ['id','created_at','itemName', 'plateNum',  'itemQty','unitName','itemPrice','loadingQty',
    'loadingPrice','driverLoan','otherExpense','net','orderFrom' ];
  public dataSource = new MatTableDataSource<any>();
  totalOtherExpense: number = 0;
  totalDriverLoan: number = 0;
  totalPrice: number = 0;
  totalTransportCost: number = 0;
  itemTypes: any;
  totalItem: number = 0;
  grandTotal: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private loadService: LoadService, private itemService:ItemService,
    private toastr: ToastrService , private storex:StorexService) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
    this.calaculateTotal(this.dataSource.filteredData)
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      let results: any;
      let allSolds:any;
      this.loadService.getSoldDetail(id).subscribe((res) => {
        results = res;
        this.info = results.info;
        allSolds= results.soldsFromStore.concat(results.soldsFromTruck);
        this.dataSource.data =allSolds;
        console.log("All Data ",results)
        this.toastr.success(results.info.custName + " Sales record is d", "Sales Deatil")
        this.calaculateTotal(allSolds)
      },
        (err) => this.toastr.error("Sales detail NOT loaded", "Slaes Deatil")
      );
    });
  }

  getItems() {
    this.itemService.getItemsName().subscribe(
      (res) => {
        this.itemTypes = res;
      },
      (error) => {
        console.log(error);
      }
    );
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
      this.totalPrice+=val.itemPrice * val.itemQty;
      this.totalItem+=val.itemQty;
      this.totalTransportCost += ((val.loadingQty ? val.loadingQty : 0) * (val.loadingPrice ? val.loadingPrice : 0 ));
      this.grandTotal = this.totalPrice - this.totalTransportCost + this.totalDriverLoan - this.totalOtherExpense;
    })
  }

  hasPermission(val:any)
  {
    return this.storex.hasPermission(val);
  }
}
