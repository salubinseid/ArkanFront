import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BankService } from 'src/app/Services/bank.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { TransferCreateComponent } from '../transfer-create/transfer-create.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
})
export class TransferComponent implements OnInit, AfterViewInit {
  loading = true;
  error = '';
  public filterData: string = '';
  public transfer: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public displayedColumns = [
    'id',
    'created_at',
    'amount',
    'transferTo',
    'reason',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();
  constructor(
    private router: Router,
    private storex: StorexService,
    private bankService:BankService,
    private toastr: ToastrService,
    private sharedService: SharedService
  ) {}
  ngOnInit() {
    this.getAllTransfers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  openDialog() {
    this.sharedService.openDialog(
      TransferCreateComponent,
      this.getAllTransfers,
      { height: '430px', width: '650px' }
    );
  }

  openDialogForEdit(data: any) {
    this.sharedService.openDialog(
      TransferCreateComponent,
      this.getAllTransfers,
      { height: '430px', width: '650px', data }
    );
  }

  public getAllTransfers = () => {
    this.bankService.getAllTransfers().subscribe(
      (res) => {
        this.dataSource.data = res;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.error = error.error;
      }
    );
  };

  //get single transfer account information
  public getTransfer = (id: number) => {
    this.bankService.getTransfer(id).subscribe(
      (res) => {
        this.transfer = res;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.error = error.error;
      }
    );
  };

  public viedDetail = (id: string) => {
    this.router.navigate(['transfers/detail', { id: id }]);
  };
  public updateRecord = (data: any) => {
    // this.getTransfer(data.id);
    this.openDialogForEdit(data);
  };

  //delete transfer
  public deleteRecord = (record: any) => {
    // this.getTransfer(id);
    // console.log(this.transfer);

    if (
      confirm(
        record.amount +
          ' ብር የተደረገው ሒሳብ መሰረዝ ትፈልጋለህ?'
      )
    ) {
      this.bankService.deleteTransfer(record.id).subscribe(
        (res) => {
          this.toastr.success(
            'በ' +
              record.transferTo +
              ' ' +
              record.amount +
              'ብር የተደረገው ሒሳብ በትክክል ተሰርዟል፡፡',
            'በትክክል መሰረዝ'
          );
          this.getAllTransfers();
        },
        (error) => {
          this.toastr.error('የተላለፈው ሒሳብ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
