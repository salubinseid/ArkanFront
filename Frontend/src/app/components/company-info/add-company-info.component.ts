import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompanyInfoService } from 'src/app/Services/company-info.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-add-company-info',
  templateUrl: './add-company-info.component.html',
  styleUrls: [],
})
export class AddCompanyInfoComponent implements OnInit {
  public form!: FormGroup;
  public actionButton: string = 'መዝግብ';
  public company: any;
  public error = '';

  constructor(
    private service: CompanyInfoService,
    private router: Router,
    private fb: FormBuilder,
    private storex: StorexService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddCompanyInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      ownerName: ['', Validators.required],
      phone1: ['', Validators.required],
      phone2: [''],
      address: [''],
    });
    // console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.form.controls['companyName'].setValue(this.editData.companyName);
      this.form.controls['ownerName'].setValue(this.editData.ownerName);
      this.form.controls['phone1'].setValue(this.editData.phone1);
      this.form.controls['phone2'].setValue(this.editData.phone2);
      this.form.controls['address'].setValue(this.editData.address);
    }
  }
  add() {
    if (!this.editData) {
      if (this.form.valid) {
        this.service.post(this.form.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.update();
    }
  }

  update() {
    this.service.put(this.form.value, this.editData.id).subscribe(
      (res: any) => {
        this.toastr.success(res.message, res.title);
        this.form.reset();
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
      this.form.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/companyInfo');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
