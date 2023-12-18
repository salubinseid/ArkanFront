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
import { StorexService } from '../../Services/storex.service';

@Component({
  selector: 'app-add-expense-type',
  templateUrl: './add-expense-type.component.html',
  styleUrls: ['./add-expense-type.component.css'],
})
export class AddExpenseTypeComponent implements OnInit {
  public expenseTypeForm!: FormGroup;
  public actionButton: string = 'መዝግብ';
  public expenseType: any;
  public error = '';

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private fb: FormBuilder,
    private storex: StorexService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddExpenseTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.expenseTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      createdBy: [this.storex.getLoginUser()],
    });
    // console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.expenseTypeForm.controls['name'].setValue(this.editData.name);
      this.expenseTypeForm.controls['description'].setValue(
        this.editData.description
      );
      this.expenseTypeForm.controls['createdBy'].setValue(
        this.storex.getLoginUser()
      );
    }
  }
  addExpenseType() {
    if (!this.editData) {
      if (this.expenseTypeForm.valid) {
        this.expenseService.register(this.expenseTypeForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateExpenseType();
    }
  }

  updateExpenseType() {
    this.expenseService
      .put(this.expenseTypeForm.value, this.editData.id)
      .subscribe(
        (res: any) => {
          this.toastr.success(res.message, res.title);
          this.expenseTypeForm.reset();
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
      this.expenseTypeForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/expenseTypes');
  }
  handleError(error: any) {
    console.log(error);
    this.toastr.error(error.message, error.title);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
