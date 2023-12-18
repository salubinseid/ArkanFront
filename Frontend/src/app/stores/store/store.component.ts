import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/Services/store.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { StoreCreateComponent } from '../store-create/store-create.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  loading: boolean = true;
  error = '';
  stores: any;
  store: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'sno',
    'storeName',
    'location',
    'fullName',
    'remark',
    'created_at',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(
    private storeService: StoreService,
    private sharedService: SharedService,
    private storex: StorexService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllStores();
  }
  openDialog() {
    this.sharedService.openDialog(StoreCreateComponent, this.getAllStores, {
      height: '550px',
      width: '550px',
    });
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(StoreCreateComponent, this.getAllStores, {
      height: '550px',
      width: '550px',
      data: data,
    });
  }

  getAllStores = () => {
    this.storeService.getAllStores().subscribe(
      (result) => {
        this.dataSource.data = result;
        this.loading = false;
      },
      (error) => {
        this.error = error.error;
        this.loading = false;
      }
    );
  };

  viewDetail(id: any) {
    this.router.navigate(['stores/detail', { id: id }]);
  }

  public updateRecord = (data: any) => {
    // this.getBank(id);
    this.openDialogForEdit(data);
  };
  //get single bank account information
  public getStore = (id: number) => {
    this.storeService.getStore(id).subscribe(
      (res) => {
        this.store = res;
      },
      (error) => console.log(error)
    );
  };
  //delete bank record
  public deleteRecord = (data: any) => {
    // this.getStore(id);

    if (confirm('የ' + data.storeName + ' መጋዘን መሰረዝ ትፈልጋለህ?')) {
      this.storeService.deleteStore(data.id).subscribe(
        (res) => {
          this.toastr.success(
            'የ' + data.storeName + ' መጋዘን በትክክል ተሰርዟል፡፡',
            'በትክክል መሰረዝ'
          );
          this.getAllStores();
        },
        (error) => {
          console.log(error);
          this.toastr.error('መጋዘኑ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
