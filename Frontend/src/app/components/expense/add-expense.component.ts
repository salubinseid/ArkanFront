import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../../Services/expense.service';
import { MoneyTypeService } from '../../Services/money-type.service';
import { StorexService } from '../../Services/storex.service';
import { AddExpenseTypeComponent } from './add-expense-type.component';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
})
export class AddExpenseComponent implements OnInit {
  public expenseForm!: FormGroup;
  public actionButton: string = 'መዝግብ';
  public expense: any;
  expenseTypes: any;
  moneyTypes: any;
  public error = '';

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private fb: FormBuilder,
    private storex: StorexService,
    private moneyTypeService: MoneyTypeService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddExpenseTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.getExpenseTypes();
    this.getMoneyTypes();
    this.expenseForm = this.fb.group({
      expenseName: ['', Validators.required],
      amount: [
        '',
        [Validators.required, Validators.pattern(/^\d+[.]?\d{0,2}$/)],
      ],
      moneyType: ['', Validators.required],
      exchangeRate: [1, ],
      description: [''],
      createdBy: [this.storex.getLoginUser()],
    });
    console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.expenseForm.controls['expenseName'].setValue(
        this.editData.expenseName
      );
      this.expenseForm.controls['amount'].setValue(this.editData.amount);
      this.expenseForm.controls['moneyType'].setValue(this.editData.moneyType);
      this.expenseForm.controls['exchangeRate'].setValue(this.editData.exchangeRate);


      this.expenseForm.controls['description'].setValue(
        this.editData.description
      );
      this.expenseForm.controls['createdBy'].setValue(
        this.storex.getLoginUser()
      );
    }
  }

  getMoneyTypes() {
    this.moneyTypeService.getByName().subscribe(
      (res) => {
        this.moneyTypes = res;
      },
      (error) => console.log(error)
    );
  }

  getExpenseTypes() {
    this.expenseService.getByName().subscribe(
      (res) => {
        this.expenseTypes = res;
        console.log(res);
      },
      (error) => console.log(error)
    );
  }
  addExpense() {
    if (!this.editData) {
      if (this.expenseForm.valid) {
        this.expenseService.registerExpense(this.expenseForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateExpense();
    }
  }

  updateExpense() {
    this.expenseService
      .putExpense(this.expenseForm.value, this.editData.id)
      .subscribe(
        (res: any) => {
          this.toastr.success(res.message, res.title);
          this.expenseForm.reset();
          this.dialogRef.close('update');
        },
        (error: any) => this.handleError(error)
      );
  }

  handleResponse(data: any) {
    if (data.error) {
      this.toastr.error(data.message, data.title);
    } else {
      this.toastr.success(data.message, data.title);
      this.expenseForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/expenses');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
