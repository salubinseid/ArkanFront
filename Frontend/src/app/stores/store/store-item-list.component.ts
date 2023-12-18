import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from '../../Services/store.service';
import { StorexService } from '../../Services/storex.service';

@Component({
  selector: 'app-store-item-list',
  templateUrl: './store-item-list.component.html',
  styleUrls: ['./store-item-list.component.css'],
})
export class StoreItemListComponent implements OnInit {
  public filterData: string = '';
  public transactions: any;
  public item: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public displayedColumns = [
    'id',
    'created_at',
    'quantity',
    'unitName',
    'mode',
    'remark',
  ];
  public dataSource = new MatTableDataSource<any>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService,
    private toastr: ToastrService,
    private storexService: StorexService
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
      let itemId = params.get('id');
      let storeId = params.get('storeId');
      this.storeService.getStoreItemList(storeId, itemId).subscribe(
        (res: any) => {
          this.dataSource.data = res.logs;
          this.item = res.item;
          console.log(this.item);
          this.toastr.success('የመጋዘኑ ዝርዝር መረጃ ተጭኗል፡፡', 'ዝርዝር መረጃ');
        },
        (err) => this.toastr.error('የመጋዘኑ ዝርዝር መረጃ አልተጫነም፡፡', 'ያልተሳካ')
      );
    });
  }

  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
