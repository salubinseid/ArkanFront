import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from 'src/app/Services/expense.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { AddExpenseComponent } from 'src/app/components/expense/add-expense.component';
import { AddIncomeExpenseComponent } from './add-income-expense.component';

@Component({
  selector: 'app-income-expense',
  templateUrl: './income-expense.component.html',
  styleUrls: ['./income-expense.component.css']
})
export class IncomeExpenseComponent implements OnInit {

  loading: boolean = true;
  error = '';
  expenses: any;
  expense: any;
  totalExpense = 0;
  totalExpenseInBirr = 0;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'sno',
    'updated_at',
    'name',
    'type',
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
    private expenseService: ExpenseService,
    private sharedService: SharedService,
    private storex: StorexService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllIncomeExpenses();
  }
  openDialog() {
    this.sharedService.openDialog(AddIncomeExpenseComponent, this.getAllIncomeExpenses, {
      height: '420px',
      width: '620px',
    });
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(AddIncomeExpenseComponent, this.getAllIncomeExpenses, {
      height: '420px',
      width: '620px',
      data: data,
    });
  }

  getAllIncomeExpenses = () => {
    this.expenseService.getAllIncomeExpense().subscribe(
      (result) => {
        console.log(result,"-------------")
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
  public getExpense = (id: number) => {
    this.expenseService.getIncomeExpense(id).subscribe(
      (res) => {
        this.expense = res;
      },
      (error) => console.log(error)
    );
  };
  //delete bank record
  public deleteRecord = (data: any) => {

    if (confirm('የ ' + data.expenseName + ' የገቢ ወጩን አይነት መሰረዝ ትፈልጋለህ?')) {
      this.expenseService.deleteIncomeExpense(data.id).subscribe(
        (res) => {
          const ctry = res;
          this.toastr.success(ctry.message, ctry.title);
          this.getAllIncomeExpenses();
        },
        (error) => {
          this.toastr.error(' የገቢ ወጩን አይነት አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
