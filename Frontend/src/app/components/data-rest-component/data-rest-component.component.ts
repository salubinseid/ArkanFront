import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataResetService } from 'src/app/Services/data-reset.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-data-rest-component',
  templateUrl: './data-rest-component.component.html',
  styleUrls: ['./data-rest-component.component.css'],
})
export class DataRestComponentComponent implements OnInit {
  constructor(
    private storex: StorexService,
    private resetService: DataResetService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  dataReset(data: any) {
    if (data == 'StoredItem') {
      // call the api here
      if (confirm('የሁሉንም መጋዘን ገቢ ዕቃዎች መሰረዝ ትፈልጋለህ?')) {
        this.resetService.resetStoredItem().subscribe(
          (res) => {
            console.log('Response', res);
            this.toastr.success('የሁሉም መጋዘን ያሉ ዕቃዎች ተሰርዘዋል፡፡', 'የተሳካ ሂደት');
          },
          (error) => {
            this.toastr.error(' የሁሉም መጋዘን ያሉ ዕቃዎች አልተሰረዘም፡፡', 'ያልተሳካ ሙከራ');
          }
        );
      }
    } else if (data == 'SoldItem') {
      // call the other api here
      if (confirm('ሁሉንም የተሸጡ ዕቃዎች መረጃ መሰረዝ ትፈልጋለህ?')) {
        this.resetService.resetSoldItem().subscribe(
          (res) => {
            this.toastr.success('ሁሉም የተሸጡ ዕቃዎች መረጃ ተሰርዘዋል፡፡', 'የተሳካ ሂደት');
          },
          (error) => {
            this.toastr.error('የተሸጡ ዕቃዎች መረጃ አልተሰረዘም፡፡', 'ያልተሳካ ሙከራ');
          }
        );
      }
    } else if (data == 'CustomerTransaction') {
      // call the other api here
      if (confirm('Do you want to delete all customer related transactions?')) {
        this.resetService.resetCustomerData().subscribe(
          (res) => {
            this.toastr.success(
              'Customer transcation data deleted፡፡',
              'የተሳካ ሂደት'
            );
          },
          (error) => {
            this.toastr.error('መረጃ አልተሰረዘም፡፡', 'ያልተሳካ ሙከራ');
          }
        );
      }
    }
    else if (data == 'PurchasedItem') {
      // call the other api here
      if (confirm('ሁሉንም Purchased ዕቃዎች መረጃ መሰረዝ ትፈልጋለህ?')) {
        this.resetService.resetPurchasedItem().subscribe(
          (res) => {
            this.toastr.success('ሁሉም purchased ዕቃዎች መረጃ ተሰርዘዋል፡፡', 'የተሳካ ሂደት');
          },
          (error) => {
            this.toastr.error('የተሸጡ purchased መረጃ አልተሰረዘም፡፡', 'ያልተሳካ ሙከራ');
          }
        );
      }
    }
    else if (data == 'BankTransaction') {
      // call the other api here
      if (confirm('Do you eant to reset all bank transaction.')) {
        this.resetService.resetBankData().subscribe(
          (res) => {
            this.toastr.success(
              'All banks info restored successfully.',
              'የተሳካ ሂደት'
            );
          },
          (error) => {
            this.toastr.error('መረጃ አልተሰረዘም፡፡', 'ያልተሳካ ሙከራ');
          }
        );
      }
    }


  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
