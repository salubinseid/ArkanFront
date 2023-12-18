import { MatTableDataSource } from '@angular/material/table';
import { UnitService } from './../Services/unit.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/Services/purchase.service';
import { StorexService } from 'src/app/Services/storex.service';
import { SharedService } from '../Services/shared.service';
import { UpdatePurchaseItemComponent } from './update-purchase-item.component';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css'],
})
export class PurchaseDetailComponent implements OnInit {
  load: any;
  public filterData: string = '';
  loading = true;
  error = '';
  unitLoading = '';
  purchaseLog: any;
  public dataSource = new MatTableDataSource<any>();
  public dataSource2 = new MatTableDataSource<any>();
  public displayedColumns = [
    'updated_at',
    'itemName',
    'lateArrivedQty',
    'remainPaid',
    'loadingCode',
    'remark',
    'actions',
  ];
  public displayedColumns2 = [
    'updated_at',
    'expenseName',
    'amount',
    'moneyType',
    'exchangeRate',
    'inBirr',
    'description',
  ];
  total: number = 0;

  // public displayedColumns = ['id', 'amount', 'inOut', 'reason', 'custName'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private storex: StorexService,
    private purchaseService: PurchaseService,
    private toastr: ToastrService,
    private unitService: UnitService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadPurchaseDetail();
  }

  loadPurchaseDetail = () => {
    let id;
    this.activatedRoute.paramMap.subscribe((params) => {
      id = params.get('id');
    });

    this.purchaseService.get(id).subscribe(
      (res) => {
        this.load = res;
        this.getUnitName(this.load.purchaseUnit);

        //get the purchase lof if there
        this.purchaseService.getLog(id).subscribe(
          (res: any) => {
            this.dataSource.data = res.data;
            this.dataSource2.data = res.expense;
            this.calculateTotal(this.dataSource2.data);
          },
          (err: any) => (this.error = err.error)
        );
        //this.toastr.success(this.load.itemName + ' የግዥ መረጃ ዝርዝር', 'የግዥ መረጃ');
        this.loading = false;
      },
      (err) => {
        this.error = err.error;
        this.loading = false;
        this.toastr.error('Item load detail NOT loaded', 'Load Deatil');
      }
    );
    this;
  };
  calculateTotal(data: any) {
    this.total = 0;
    data.map((val: any) => {
      this.total += val.amount * val.exchangeRate;
    });
  }
  getUnitName = (id: number) => {
    this.unitService.get(id).subscribe(
      (res) => {
        this.unitLoading = res.name;
        // return res.name;
      },
      (error) => console.log(error)
    );
  };
  openDialogToUpdateQtyOrPayment = (data, isNew) => {
    this.sharedService.openDialog(
      UpdatePurchaseItemComponent,
      this.loadPurchaseDetail,
      {
        height: 'auto',
        width: '75vw',
        data: { ...data, isNew: isNew, id: data.id },
        position: { right: '50px', top: '50px' },
      }
    );
  };

  openDialogToRecordLateArrivedAndPayment = (data) => {};

  registerRemainPaymentOrItemDelivery = (data) => {
    this.openDialogToUpdateQtyOrPayment(data, true);
  };
  public updateRecord = (data: any) => {
    this.openDialogToUpdateQtyOrPayment(data, false);
  };

  //delete purchased item record
  public deleteRecord = (record: any) => {
    if (confirm('የ ' + record.itemName + ' የተመዘገበውን ዕቃ መሰረዝ ትፈልጋለህ?')) {
      this.purchaseService.delete(record.id).subscribe(
        (res) => {
          this.toastr.success('የተመዘገበው ዕቃ በትክክል ተሰርዟል፡፡', 'በትክክል መሰረዝ');
          //this.loadPurchaseDetail(r);
        },
        (error) => {
          this.toastr.error('የመጋዘኑ ዕቃ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
