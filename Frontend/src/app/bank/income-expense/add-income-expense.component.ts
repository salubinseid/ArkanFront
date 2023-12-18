import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from 'src/app/Services/expense.service';
import { MoneyTypeService } from 'src/app/Services/money-type.service';
import { StorexService } from 'src/app/Services/storex.service';
import { AddExpenseTypeComponent } from 'src/app/components/expense/add-expense-type.component';

@Component({
  selector: 'app-add-income-expense',
  templateUrl: './add-income-expense.component.html',
  styleUrls: ['./add-income-expense.component.css']
})
export class AddIncomeExpenseComponent implements OnInit {

  public incomeExpenseForm!: FormGroup;
  public actionButton: string = 'መዝግብ';
  public expense: any;
  public error = '';
  isExpense: boolean = false;

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private fb: FormBuilder,
    private storex: StorexService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddExpenseTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.incomeExpenseForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      createdBy: [this.storex.getLoginUser()],
    });
    console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.incomeExpenseForm.controls['name'].setValue(this.editData.name);
      this.incomeExpenseForm.controls['type'].setValue(this.editData.type);
      this.incomeExpenseForm.controls['description'].setValue(this.editData.description);
      this.incomeExpenseForm.controls['createdBy'].setValue(this.storex.getLoginUser());
    }
  }

  selectedInOut = (data: any) =>{
    console.log(this.incomeExpenseForm.value);
    if(data.value=='ወጪ' )
      this.isExpense = true;
    else
      this.isExpense = false
  }

  addIncomeExpense() {
    if (!this.editData) {
      if (this.incomeExpenseForm.valid) {
        console.log("user ",this.incomeExpenseForm.value, this.storex.getLoginUser());
        this.expenseService.registerIncomeExpense(this.incomeExpenseForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateIncomeExpense();
    }
  }

  updateIncomeExpense() {
    this.expenseService
      .putIncomeExpense(this.incomeExpenseForm.value, this.editData.id)
      .subscribe(
        (res: any) => {
          this.toastr.success(res.message, res.title);
          this.incomeExpenseForm.reset();
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
      this.incomeExpenseForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/incomeExpenseTypes');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
