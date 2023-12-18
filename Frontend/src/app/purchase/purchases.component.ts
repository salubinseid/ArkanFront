import { ItemService } from './../Services/item.service';
import { UnitService } from './../Services/unit.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from '../Services/purchase.service';
import { SharedService } from '../Services/shared.service';
import { StorexService } from '../Services/storex.service';
import { AddPurchaseItemComponent } from './add-purchase-item.component';
import { StoreService } from '../Services/store.service';
import { UpdatePurchaseItemComponent } from './update-purchase-item.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent implements OnInit {
  loading: boolean = true;
  error = '';
  items: any;
  purchasedItem: any;
  itemType="";

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'id',
    'updated_at',
    // 'loadingCode',
    'itemName',
    // 'purchaseQty',
    'qty',
    'delivered',
    'unitName',
    'gudlet',
    'totalPrice',
    'totalPriceInBirr',
    'advancePaid',
    'remainPayment',
    'deliveredToStore',
    // 'remain',
    // 'company',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();
  selected: any;
  cgqEditMode: boolean = false;
  cdqEditMode = false;
  crqEditMode = false;
  unitName: any;
  isHover = false;
  totalAdvancePaid: number = 0;
  totalAmount: number = 0;
  totalAmountInBirr: number = 0;
  totalRemainPayment: number = 0;
  totalItem: number = 0;
  totalItemPurchased: number = 0;
  totalGudelet: number = 0;
  itemTypes: any;
  stores: any;
  store: string = '';
  allStores: any;
  totalRows = 0;
  pageSize = 50;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
    this.calaculateTotal(this.dataSource.filteredData);
  }
  page = localStorage.getItem('isDelivered');
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private storexService: StorexService,
    private purchaseService: PurchaseService,
    private sharedService: SharedService,
    private unitService: UnitService,
    private itemService: ItemService,
    private storeService: StoreService
  ) {
    this.getManagedStores();
  }

  ngOnInit(): void {
    localStorage.setItem('isDelivered', 'ALL');
    this.getItems();
    this.getPurchasedItems();
    this.error = '';
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPurchasedItems();
  }

  openDialog() {
    this.sharedService.openDialog(
      AddPurchaseItemComponent,
      this.getPurchasedItems,
      {
        height: 'autoq',
        width: '75vw',
        position: { right: '50px', top: '50px' },
      }
    );
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(
      AddPurchaseItemComponent,
      this.getPurchasedItems,
      {
        height: 'auto',
        width: '75vw',
        data: data,
        position: { right: '50px', top: '50px' },
      }
    );
  }

  openDialogToUpdateQtyOrPayment = (data) => {
    this.sharedService.openDialog(
      UpdatePurchaseItemComponent,
      this.deliveredPurchases,
      {
        height: 'auto',
        width: '75vw',
        data: { ...data, isNew: true },
        position: { right: '50px', top: '50px' },
      }
    );
  };

  loadSelectedItem(event: any) {
    console.log(this.items);
    let id = event.target.value;
    console.log('====> ', id);
    if (id == -1) this.deliveredPurchases();
    else {
      let temp = this.items.filter((p: any) => p.itemId == id);
      this.dataSource.data = temp;
      this.calaculateTotal(temp);
    }
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

  calaculateTotal(res: any) {
    this.totalAdvancePaid = 0;
    this.totalAmount = 0;
    this.totalRemainPayment = 0;
    this.totalItem = 0;
    this.totalItemPurchased = 0;
    this.totalAmountInBirr = 0;
    this.totalGudelet = 0;
    res.map((val: any) => {
      this.totalAdvancePaid += val.advancePaid;
      this.totalRemainPayment += val.remainPayment;
      this.totalAmount += val.totalPrice;
      this.totalAmountInBirr += val.totalPrice * val.exchangeRate;
      this.totalItem += val.qty;
      this.totalItemPurchased += val.purchaseQty;
      this.totalGudelet += val.gudlet;
    });
  }

  getUnitName = (id: number) => {
    this.isHover = true;
    this.unitService.get(id).subscribe(
      (res) => {
        this.unitName = res.name;
      },
      (error) => console.log(error)
    );
  };
  getPurchasedItems = () => {
    this.page = localStorage.getItem('isDelivered');
    console.log('stores : ', this.sharedService.getStore());
    this.purchaseService
      .getAll(this.currentPage, this.pageSize, this.page ?? 'ALL')
      .subscribe(
        (result) => {
          let res = result;
          // this.items = result;
          // this.items
          //   .filter((f: any) => f.isDeliver == true && f.storeId != 0)
          //   .map((item: any) => {
          //     //this.storeService.getStore(item.storeId).subscribe((res)=>{
          //     this.stores.filter((res) => {
          //       this.store = res['storeName'];
          //       item['storeId'] = res['storeName'];
          //     });
          //     this.allStores.filter((s: any) => s.id === item.stroreId);
          //     {
          //       this.store = this.allStores['storeName'];
          //       item['storeId'] = this.allStores.id;
          //     }
          //   });
          this.items = res.data;
          this.dataSource.data = this.items;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = res.totalRows;
          });

          this.loading = false;
          this.calaculateTotal(res.data);
        },
        (error) => {
          this.error = error.error;
          this.loading = false;
        }
      );
  };

  registerRemainPaymentOrItemDelivery = (data) => {
    this.openDialogToUpdateQtyOrPayment(data);
  };
  public viewDetail = (id: string) => {
    this.router.navigate(['purchases/detail', { id: id }]);
  };

  public ItemDelivered = (item: any) => {
    // console.log('event = ',this.store)
    if (item.delivered <= 0) {
      this.store = '';
      let err = 'የደረሰው እቃ ብዛት በትክክል አስገባ፡፡';
      this.error = err;
      this.toastr.error(err, 'የተሳሳተ ግብዓት');
    } else {
      this.error = '';
      if (
        confirm(
          'የ ' +
            item.itemName +
            ' ዕቃ ወደብ ላይ መድረሱን እርግጠኛ ነህ? የደረሰውን/ጉድለት ካለ በቅድሚያ አስተካክል፡፡'
        )
      ) {
        this.purchaseService.updateDelivery(item.id, this.store).subscribe(
          (res) => {
            this.toastr.success(
              ' ዕቃ ወደብ ላይ በትክክል መድረሱ መረጃ ተይዟል፡፡',
              'በትክክል መሰረዝ'
            );
            this.store = '';
            this.getPurchasedItems();
          },
          (error) => {
            this.toastr.error(
              'ዕቃ ወደብ ላይ በትክክል መድረሱ መረጃ አልተያዘም፡፡',
              'ያልተሳካ መሰረዝ'
            );
          }
        );
      }
    }
  };

  public updateRecord = (data: any) => {
    this.openDialogForEdit(data);
  };

  //delete purchased item record
  public deleteRecord = (record: any) => {
    if (confirm('የ ' + record.itemName + ' የተመዘገበውን ዕቃ መሰረዝ ትፈልጋለህ?')) {
      this.purchaseService.delete(record.id).subscribe(
        (res) => {
          this.toastr.success('የተመዘገበው ዕቃ በትክክል ተሰርዟል፡፡', 'በትክክል መሰረዝ');
          this.getPurchasedItems();
        },
        (error) => {
          this.toastr.error('የመጋዘኑ ዕቃ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };
  displayEditIcon = (id) => {
    console.log('emntr or hover ==>', id);
    // this.selected = id;

    const el = document.getElementById(`editIcon`)!;
    el.style.display = 'block';
  };
  hideEditIcon = (id) => {
    console.log('hover left ==>', id);
    const el = document.getElementById(`editIcon`)!;
    el.style.display = 'none';
  };

  changeDeliveredQty(id: number) {
    this.selected = id;
    this.cdqEditMode = !this.cdqEditMode;
  }
  setDeliveredQty(data: any, event: any) {
    const val = event.target.value;
    this.cdqEditMode = !this.cdqEditMode;

    const formData = new FormData();
    formData.append('delivered', val);
    this.purchaseService.updateDeliveredQty(data.id, formData).subscribe(
      (res: any) => {
        this.getPurchasedItems();
        console.log(res);
        this.toastr.success(res.message, res.title);
      },
      (err) => this.toastr.error(err.message, err.title)
    );
  }
  changeRemainQty(id: number) {
    this.selected = id;
    this.crqEditMode = !this.crqEditMode;
  }
  setRemainQty(id: number, event: any) {
    const val = event.target.value;
    this.cdqEditMode = !this.cdqEditMode;

    const formData = new FormData();
    formData.append('delivered', val);
    this.purchaseService.updateRemainQty(id, formData).subscribe(
      (res: any) => {
        this.getPurchasedItems();
        this.toastr.success(res.message, res.title);
      },
      (err) => this.toastr.error(err.message, err.title)
    );
  }

  deliveredPurchases() {
    console.log('Deliverd ----');
    localStorage.setItem('isDelivered', 'YES');
    this.getPurchasedItems();
  }

  unDeliveredPurchases() {
    console.log('UnDeliverd ----');

    localStorage.setItem('isDelivered', 'NO');
    this.getPurchasedItems();
  }

  //
  getManagedStores = async () => {
    // let loggedInUser = this.storexService.getLoginUser();

    this.storeService.getCountryStores().subscribe(
      (res) => {
        this.stores = res;
        this.sharedService.setStore(this.stores);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  //check permission
  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
