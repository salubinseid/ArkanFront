import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MoneyTypeService } from 'src/app/Services/money-type.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { AddMoneyTypeComponent } from './add-money-type.component';

@Component({
  selector: 'app-money-type',
  templateUrl: './money-type.component.html',
  styleUrls: ['./money-type.component.css'],
})
export class MoneyTypeComponent implements OnInit {
  loading: boolean = true;
  error = '';
  moneyType: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = ['sno', 'type', 'updated_at', 'actions'];
  public dataSource = new MatTableDataSource<any>();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(
    private moneyTypeService: MoneyTypeService,
    private sharedService: SharedService,
    private storex: StorexService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllMoneyTypes();
  }
  openDialog() {
    this.sharedService.openDialog(
      AddMoneyTypeComponent,
      this.getAllMoneyTypes,
      {
        height: '300px',
        width: '500px',
      }
    );
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(
      AddMoneyTypeComponent,
      this.getAllMoneyTypes,
      {
        height: '300px',
        width: '500px',
        data: data,
      }
    );
  }

  getAllMoneyTypes = () => {
    this.moneyTypeService.getAll().subscribe(
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

  public updateRecord = (data: any) => {
    this.openDialogForEdit(data);
  };
  //get single moenyType information
  public getMoneyType = (id: number) => {
    this.moneyTypeService.get(id).subscribe(
      (res) => {
        this.moneyType = res;
      },
      (error) => console.log(error)
    );
  };
  //delete money type record
  public deleteRecord = (id: number) => {
    this.getMoneyType(id);

    if (confirm('የ' + this.moneyType.type + ' ገንዘብ አይነት መሰረዝ ትፈልጋለህ?')) {
      this.moneyTypeService.delete(id).subscribe(
        (res) => {
          const ctry = res;
          this.toastr.success(ctry.msg, ctry.title);
          this.getAllMoneyTypes();
        },
        (error) => {
          this.toastr.error('የገንዘብ አይነቱ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
