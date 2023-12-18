import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../Services/employee.service';
import { StoreService } from '../../Services/store.service';
import { StorexService } from '../../Services/storex.service';
import { TokenService } from '../../Services/token.service';

@Component({
  selector: 'app-store-create',
  templateUrl: './store-create.component.html',
  styleUrls: ['./store-create.component.css'],
})
export class StoreCreateComponent implements OnInit {
  public storeForm!: FormGroup;
  public employees: any;
  public actionButton: string = 'መዝግብ';
  public store: any;
  public error = '';
  isClicked: boolean = false;
  countries = ['ኢትዮጵያ', 'ጅቡቲ'];

  constructor(
    private empServise: EmployeeService,
    private storeService: StoreService,
    private tokenService: TokenService,
    private router: Router,
    private fb: FormBuilder,
    private storex: StorexService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<StoreCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.empServise.getEmployeesName().subscribe(
      (res) => {
        this.employees = res;
        console.log(this.employees);
      },
      (error) => {
        console.log(error);
      }
    );

    this.storeForm = this.fb.group({
      storeName: ['', Validators.required],
      location: ['', Validators.required],
      managedBy: ['', Validators.required],
      createdBy: [this.storex.getLoginUser()],
      status: [true],
      remark: [''],
    });
    // console.log(this.editData)
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.storeForm.controls['storeName'].setValue(this.editData.storeName);
      this.storeForm.controls['location'].setValue(this.editData.location);
      this.storeForm.controls['managedBy'].setValue(this.editData.managedBy);
      this.storeForm.controls['status'].setValue(true);
      this.storeForm.controls['createdBy'].setValue(this.storex.getLoginUser());
      this.storeForm.controls['remark'].setValue(this.editData.remark);
    }
  }
  addStore() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (!this.editData) {
      if (this.storeForm.valid) {
        this.storeService.register(this.storeForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateStore();
    }
  }

  updateStore() {
    this.storeService
      .putStore(this.storeForm.value, this.editData.id)
      .subscribe(
        (res: any) => {
          this.toastr.success(res.message, res.title);
          this.storeForm.reset();
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
      this.storeForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/stores');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
