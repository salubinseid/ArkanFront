import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MoneyTypeService } from 'src/app/Services/money-type.service';
import { StorexService } from 'src/app/Services/storex.service';
import { StoreCreateComponent } from 'src/app/stores/store-create/store-create.component';

@Component({
  selector: 'app-add-money-type',
  templateUrl: './add-money-type.component.html',
  styleUrls: ['./add-money-type.component.css'],
})
export class AddMoneyTypeComponent implements OnInit {
  public moneyTypeForm!: FormGroup;
  public actionButton: string = 'መዝግብ';
  public moneyType: any;
  public error = '';

  constructor(
    private moneyTypeService: MoneyTypeService,
    private router: Router,
    private fb: FormBuilder,
    private storex: StorexService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<StoreCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.moneyTypeForm = this.fb.group({
      type: ['', Validators.required],
    });
    // console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.moneyTypeForm.controls['type'].setValue(this.editData.type);
    }
  }
  addMoneyType() {
    if (!this.editData) {
      if (this.moneyTypeForm.valid) {
        this.moneyTypeService.register(this.moneyTypeForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateMoneyType();
    }
  }

  updateMoneyType() {
    this.moneyTypeService
      .put(this.moneyTypeForm.value, this.editData.id)
      .subscribe(
        (res: any) => {
          this.toastr.success(res.message, res.title);
          this.moneyTypeForm.reset();
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
      this.moneyTypeForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/moneyTypes');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
