import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ItemCreateComponent } from '../item-create/item-create.component';
import { ItemService } from '../Services/item.service';
import { SharedService } from '../Services/shared.service';
import { StorexService } from '../Services/storex.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {
  loading: boolean = true;
  error = '';
  items: any;
  item: any;
  totalRows = 0;
  pageSize = 50;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'sno',
    'itemName',
    'brand',
    'unitName',
    'fullName',
    'description',
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
    private itemService: ItemService,
    private dialog: MatDialog,
    private storex: StorexService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllItems();
  }

  pageChanged(event: PageEvent) {
    console.log('Event =>', { event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllItems();
  }

  getAllItems() {
    this.itemService.getAllItems(this.currentPage, this.pageSize).subscribe(
      (result) => {
        setTimeout(() => {
          console.log('Loding ....');
        }, 3000);
        this.dataSource.data = result.items;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = result.totalRows;
        });
        this.loading = false;
      },
      (error) => {
        console.log('ያልተሳካ መረጃ መጫን ' + error);
        this.error = error.error;
        this.loading = false;
      }
    );
  }
  openDialog() {
    let dialogRef = this.dialog
      .open(ItemCreateComponent, { height: '550px', width: '550px' })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'save') {
          this.getAllItems();
        }
      });
  }
  openDialogForEdit(data: any) {
    let dialogRef = this.dialog
      .open(ItemCreateComponent, {
        height: '550px',
        width: '550px',
        data: data,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'update') {
          this.getAllItems();
        }
      });
  }
  //get single item account information
  public getItem = (id: number) => {
    this.itemService.getItem(id).subscribe(
      (res) => {
        this.item = res;
      },
      (error) => console.log(error)
    );
  };

  viewDetail(id: any) {}
  public updateRecord = (data: any) => {
    // this.getItem(id);
    this.openDialogForEdit(data);
  };

  //delete item record
  public deleteRecord = (data: any) => {
    // this.getItem(id);

    if (confirm('የ' + data.itemName + ' የዕቃ መረጃን መሰረዝ ትፈልጋለህ?')) {
      this.itemService.deleteItem(data.id).subscribe(
        (res) => {
          this.toastr.success(
            'የ' + data.itemName + ' ዕቃው በትክክል ተሰርዟል፡፡',
            'በትክክል መሰረዝ'
          );
          this.getAllItems();
        },
        (error) => {
          this.toastr.error('የዕቃው መረጃ አልትሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };
  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
