import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../../Services/expense.service';
import { SharedService } from '../../Services/shared.service';
import { StorexService } from '../../Services/storex.service';
import { AddExpenseTypeComponent } from './add-expense-type.component';

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrls: ['./expense-type.component.css'],
})
export class ExpenseTypeComponent implements OnInit {
  loading: boolean = true;
  error = '';
  expenseTypes: any;
  expenseType: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'sno',
    'name',
    'description',
    'fullName',
    'updated_at',
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
    private expTypeService: ExpenseService,
    private sharedService: SharedService,
    private storex: StorexService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllExpenseTypes();
  }
  openDialog() {
    this.sharedService.openDialog(
      AddExpenseTypeComponent,
      this.getAllExpenseTypes,
      {
        height: '400px',
        width: '450px',
      }
    );
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(
      AddExpenseTypeComponent,
      this.getAllExpenseTypes,
      {
        height: '400px',
        width: '450px',
        data: data,
      }
    );
  }

  getAllExpenseTypes = () => {
    this.expTypeService.getAll().subscribe(
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
  //get single country information
  public getExpenseType(id: number) {
    this.expTypeService.get(id).subscribe(
      (res) => {
        this.expenseType = res;
      },
      (error) => console.log(error)
    );
  }
  //delete expenseType record
  public deleteRecord = (data: any) => {
    console.log("Data = ",data)
    if (confirm('የ' + data.name + ' የወጪ አይነትን መሰረዝ ትፈልጋለህ?')) {
      this.expTypeService.delete(data.id).subscribe(
        (res) => {
          const ctry = res;
          this.toastr.success(ctry.message, ctry.title);
          this.getAllExpenseTypes();
        },
        (error) => {
          this.toastr.error(' የወጪ አይነት አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
