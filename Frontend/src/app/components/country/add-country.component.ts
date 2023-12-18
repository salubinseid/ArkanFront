import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../Services/country.service';
import { StorexService } from '../../Services/storex.service';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css'],
})
export class AddCountryComponent implements OnInit {
  public countryForm!: FormGroup;
  public actionButton: string = 'መዝግብ';
  public country: any;
  public error = '';

  constructor(
    private countryService: CountryService,
    private router: Router,
    private fb: FormBuilder,
    private storex: StorexService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddCountryComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    // console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.countryForm.controls['name'].setValue(this.editData.name);
      this.countryForm.controls['description'].setValue(
        this.editData.description
      );
    }
  }
  addCountry() {
    if (!this.editData) {
      if (this.countryForm.valid) {
        this.countryService.register(this.countryForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateCountry();
    }
  }

  updateCountry() {
    this.countryService.put(this.countryForm.value, this.editData.id).subscribe(
      (res: any) => {
        this.toastr.success(res.message, res.title);
        this.countryForm.reset();
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
      this.countryForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/countries');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
