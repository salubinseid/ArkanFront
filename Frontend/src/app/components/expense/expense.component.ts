import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AddExpenseComponent } from './add-expense.component';
import { ExpenseService } from 'src/app/Services/expense.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
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
    'expenseType',
    'loadingCode',
    'amount',
    'exchangeRate',
    'amountInBirr',
    'description',
    'createdBy',
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
    this.getAllExpenses();
  }
  openDialog() {
    this.sharedService.openDialog(AddExpenseComponent, this.getAllExpenses, {
      height: '420px',
      width: '620px',
    });
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(AddExpenseComponent, this.getAllExpenses, {
      height: '420px',
      width: '620px',
      data: data,
    });
  }

  getAllExpenses = () => {
    this.expenseService.getAllExpense().subscribe(
      (result) => {
        this.dataSource.data = result;
        this.loading = false;
        this.calculateTotal(this.dataSource.data);
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
    this.expenseService.getExpense(id).subscribe(
      (res) => {
        this.expense = res;
        console.log(res);
      },
      (error) => console.log(error)
    );
  };
  //delete bank record
  public deleteRecord = (id: number) => {
    this.getExpense(id);

    if (confirm('የ ' + this.expense.expenseName + ' ወጪን መሰረዝ ትፈልጋለህ?')) {
      this.expenseService.deleteExpense(id).subscribe(
        (res) => {
          const ctry = res;
          this.toastr.success(ctry.message, ctry.title);
          this.getAllExpenses();
        },
        (error) => {
          this.toastr.error(' ወጩ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  calculateTotal(res:any){
    this.totalExpense = 0;
    res.map((val:any)=>{
      this.totalExpense += val.amount;
      this.totalExpenseInBirr += (val.amount * val.exchangeRate)
    })
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
