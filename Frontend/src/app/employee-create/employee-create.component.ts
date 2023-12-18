import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../Services/employee.service';
import { StorexService } from '../Services/storex.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  // styleUrls: ['./employee-create.component.css'],
})
export class EmployeeCreateComponent implements OnInit {
  employeeForm!: FormGroup;
  public error = '';
  public actionButton: string = 'መዝግብ';
  isClicked: boolean = false;
  countries = ['ኢትዮጵያ', 'ጅቡቲ'];
  showPassword = false;
  showPasswordConf = false;
  headerTitle = 'የሰራተኛ መረጃ መመዝገቢያ';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private fb: FormBuilder,
    private storex: StorexService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^((\\+[0-9]{3}?)|0)?[0-9]{9}$'),
          Validators.maxLength(13),
          Validators.minLength(10),
        ],
      ],
      email: [''],
      country: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      status: [true],
      createdBy: [this.storex.getLoginUser()],
    });

    // console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.headerTitle = 'የሰራተኛ መረጃ ማስተካኪያ';
      this.employeeForm.controls['fullName'].setValue(this.editData.fullName);
      this.employeeForm.controls['phone'].setValue(this.editData.phone);
      this.employeeForm.controls['email'].setValue(this.editData.email);
      this.employeeForm.controls['country'].setValue(this.editData.country);
      this.employeeForm.controls['username'].setValue(this.editData.username);
      this.employeeForm.controls['status'].setValue(true);
      this.employeeForm.controls['createdBy'].setValue(
        this.storex.getLoginUser()
      );
    }
  }

  addEmployee() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (!this.editData) {
      if (this.employeeForm.valid) {
        this.employeeService.register(this.employeeForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateEmployee();
    }
  }

  updateEmployee() {
    this.employeeService
      .putEmployee(this.employeeForm.value, this.editData.id)
      .subscribe(
        (res) => {
          this.handleResponse(res);
        },
        (error) => this.handleError(error)
      );
  }

  handleResponse(data: any) {
    // this.tokenService.handleToken(data.access_token);
    if (data.error) {
      this.toastr.error(data.message, data.title);
    } else {
      this.toastr.success(data.message, data.title);
      this.employeeForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/employees');
  }
  handleError(error: any) {
    this.isClicked = false;
    console.log(error);
    this.error = error.error.message;
  }

  // convenience getter for easy access to form fields
  get emp() {
    return this.employeeForm.controls;
  }

  get phone() {
    return this.employeeForm.get('phone');
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
