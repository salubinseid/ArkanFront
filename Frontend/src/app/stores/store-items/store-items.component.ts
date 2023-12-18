import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/Services/shared.service';
import { StoreService } from 'src/app/Services/store.service';
import { StorexService } from 'src/app/Services/storex.service';
import { AddItemComponent } from '../add-item/add-item.component';
import { TransferItemsComponent } from './transfer-items.component';
import { BasketService } from 'src/app/components/basket/basket.service';

@Component({
  selector: 'app-store-items',
  templateUrl: './store-items.component.html',
  styleUrls: ['./store-items.component.css'],
})
export class StoreItemsComponent implements OnInit {
  loading: boolean = true;
  error = '';
  storedItem: any;
  items: any;
  store: string = '';
  stores: any = [];
  csEditMode = false;
  salesPrice = 0;
  salesQty = 0;
  selectedRecord: any;
  selected = { id: 0, data: { qty: 0, price: 0 } };
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
    'salesQty',
    'salesPrice',
    'storeName',
    'fullName',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();
  cspEditMode: boolean = false;
  csqEditMode: boolean = false;

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
    private toastr: ToastrService,
    private router: Router,
    private storexService: StorexService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.getItemsInStore();
  }

  openDialog() {
    this.sharedService.openDialog(AddItemComponent, this.getItemsInStore, {
      height: '550px',
      width: '550px',
    });
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(AddItemComponent, this.getItemsInStore, {
      height: '550px',
      width: '550px',
      data: data,
    });
  }
  openTransferDialog(data: any) {
    this.sharedService.openDialog(
      TransferItemsComponent,
      this.getItemsInStore,
      { height: '460px', width: '665px', data: data }
    );
  }

  getItemsInStore = () => {
    this.storeService.getItemsInStore().subscribe(
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

  //get single bank account information
  public getStoredItem = (id: number) => {
    this.storeService.getStoredItems(id).subscribe(
      (res) => {
        this.storedItem = res;
      },
      (error) => console.log(error)
    );
  };
  public viewDetail = (id: string) => {
    this.router.navigate(['stores/items/detail', { id: id }]);
  };

  public updateRecord = (data: any) => {
    this.openDialogForEdit(data);
  };

  //delete stored item record
  public deleteRecord = (data: any) => {
    // this.getStoredItem(id);

    if (confirm('የ' + data.quantity + ' የመጋዘኑን ዕቃ መሰረዝ ትፈልጋለህ?')) {
      this.storeService.deleteStoredItem(data.id).subscribe(
        (res) => {
          this.toastr.success(
            'የ' + data.quantity + ' የመጋዘኑ ዕቃ በትክክል ተሰርዟል፡፡',
            'በትክክል መሰረዝ'
          );
          this.getItemsInStore();
        },
        (error) => {
          this.toastr.error('የመጋዘኑ ዕቃ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };
  //set sales price of single item
  setSalesPrice(data: any, event: any) {
    const price = event.target.value;
    this.selected.id = data.id;
    this.selected.data.price = price;
    // console.log("id => ", this.selected.id);
    // data['salesPrice'] = price

    this.dataSource.data
      .filter((x) => x.id == data.id)
      .map((a) => (a.salesPrice = price));

    if (data['salesPrice']) {
      // this.getItemsInStore();
      this.toastr.success('Item price set', 'Price Set');
    } else {
      this.toastr.error('Price not Set', 'Failed');
    }
  }

  //set sales price of single item
  setSalesQty(data: any, event: any) {
    const qty = event.target.value;
    this.selected.id = data.id;
    this.selected.data.qty = qty;

    // data['salesQty'] = qty

    if (qty > data.quantity) {
      this.toastr.error('Enogh item NOT found', 'Error');
    } else {
      this.dataSource.data
        .filter((x) => x.id == data.id)
        .map((a) => (a.salesQty = qty));
      this.toastr.success(
        data['itemName'] + ' Item quantity set',
        'Quantity Set'
      );
    }
  }

  addToCart(data: any) {
    data['orderFrom'] = 'ከመጋዘን';
    if (
      data.salesPrice <= 0 ||
      data.salesPrice == null ||
      data.salesPrice == ''
    ) {
      this.toastr.error('በቅድሚያ የአንዱን ዕቃ መሸጫ ዋጋ ሙላ!', 'ዋጋ አልተሞላም');
    } else {
      if (data.salesQty > data.quantity) {
        this.toastr.error('በቂ ዕቃ በመጋዘን የለም!', 'ስህተት');
      } else this.basketService.addToCart(data);
    }
  }
  changeSalesPrice(id: number) {
    this.selected.id = id;
    this.cspEditMode = !this.cspEditMode;
  }

  changeSalesQty(id: number) {
    this.selected.id = id;
    // this.selected.data.qty = id;
    this.csqEditMode = !this.csqEditMode;
  }
  //transferItem from one store to another
  transferItem(id: number) {}

  //check permission
  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
