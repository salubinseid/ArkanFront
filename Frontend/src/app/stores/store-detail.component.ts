import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreService } from '../Services/store.service';
import { StorexService } from '../Services/storex.service';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.css'],
})
export class StoreDetailComponent implements OnInit {
  loading: boolean = true;
  error = '';
  items: any;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'id',
    'updated_at',
    'itemName',
    'brand',
    'quantity',
    'unitName',
    'remark',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();
  cspEditMode: boolean = false;
  csqEditMode: boolean = false;
  storeId: any;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(
    private storeService: StoreService,
    private toastr: ToastrService,
    private storexService: StorexService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.storeId = params.get('id');
      let results: any;
      this.storeService.getItemsInSingleStore(this.storeId).subscribe(
        (res) => {
          results = res;
          this.items = results;
          this.dataSource.data = results;
          this.loading = false;
          this.toastr.success('Store item is loaded', 'Store Deatil');
        },
        (err) => {
          this.error = err.error;
          this.loading = false;
          this.toastr.error('Store detail NOT loaded', 'Store Deatil');
        }
      );
    });
    // this.getItemsInStore();
  }

  public viewDetail = (id: string) => {
    this.router.navigate([
      'stores/item/detail',
      { id: id, storeId: this.storeId },
    ]);
  };

  //check permission
  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
