import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/Services/customer.service';
import { LoadService } from 'src/app/Services/load.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { LoadCreateComponent } from '../load-create/load-create.component';

@Component({
  selector: 'app-sold',
  templateUrl: './sold.component.html',
  styleUrls: ['./sold.component.css'],
})
export class SoldComponent implements OnInit {
  loading: boolean = true;
  loads: any;
  price: number = 0;
  editMode: boolean = false;
  status: string = '';
  csEditMode = false;
  customer = '';
  customers: any = [];

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'id',
    'created_at',
    'custName',
    'itemName',
    // 'plateNum',
    'totalPrice',
    'paidAmount',
    'remainAmount',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();
  selected: any = 0;
  totalPrice: any = 0;
  totalRemain: any = 0 ;
  totalPaid: number = 0;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
    this.calaculateTotal(this.dataSource.filteredData)
  }

  editStatus(id: number) {
    this.selected = id;
    this.editMode = !this.editMode;
  }

  updateStatus() {
    console.log(this.status);
  }

  constructor(
    private loadService: LoadService,
    private shared: SharedService,
    private storex: StorexService,
    private dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private custService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getAllSoldLoads();
  }

  openDialog() {
    this.dialog
      .open(LoadCreateComponent, { height: '550px', width: '550px' })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'save') {
          this.getAllSoldLoads();
        }
      });
  }

  openDialogForEdit(data: any) {
    this.dialog
      .open(LoadCreateComponent, {
        height: '550px',
        width: '550px',
        data: data,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'update') {
          this.getAllSoldLoads();
        }
      });
  }

  getAllSoldLoads(mode = 'ALL') {
    this.loadService.getAllSoldLoads().subscribe(
      (result) => {
        let res = result
        if(mode == 'ከመኪና')
          this.dataSource.data = res.soldsFromTruck;
        else if(mode=='ከመጋዘን')
          this.dataSource.data = res.soldsFromStore;
        else
          this.dataSource.data = res.soldsFromTruck.concat(res.soldsFromStore);

        this.calaculateTotal(this.dataSource.data);
        this.loading = false;
        console.log(result)
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  viewDetail(id: any) {
    this.router.navigate(['sales/detail', { id: id }]);
  }

  updateRecord(record: any) {
    this.shared.openDialog(LoadCreateComponent, record, {
      height: '450px',
      width: '550px',
      record,
    });
  }

  changeShemach(id: number) {
    this.selected = id;
    this.csEditMode = !this.csEditMode;
    this.custService.getCustomersName().subscribe(
      (res) => {
        this.customers = res;
      },
      (error) => {
        this.toaster.error('Failed to load stores', 'Failed');
      }
    );
  }

  //here change the store unloaded
  updateShemach = (id: number, event: any) => {
    const customer = event.target.value;
    const formData = new FormData();
    formData.append('customer', customer);
    console.log('Customer info =>', customer, '====> ', formData);
    this.custService.updateShemach(id, formData).subscribe(
      (res: any) => {
        this.getAllSoldLoads();
        this.toaster.success(res.message, res.title);
      },
      (err) => this.toaster.error(err.message, err.title)
    );
    this.csEditMode = false;
  };
  deleteRecord(id: any) {}

  calaculateTotal(res:any){
    this.totalPrice = 0  ;
    this.totalRemain = 0  ;
    this.totalPaid = 0;

    res.map((val:any)=>{
      this.totalPrice+= val.totalPrice ? val.totalPrice : 0;
      this.totalRemain+= val.remainAmount ? val.remainAmount : 0;
      this.totalPaid+= val.paidAmount ? val.paidAmount : 0;
    })
  }


  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
