import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorexService } from 'src/app/Services/storex.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-permission-create',
  templateUrl: './permission-create.component.html',
})
export class PermissionCreateComponent implements OnInit {

  public actionButton: string = "መዝግብ";
  permissionForm!: FormGroup;
  error = '';
  permissions: any
  constructor(private router: Router, private toastr: ToastrService,
    private dialogRef: MatDialogRef<PermissionCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private fb: FormBuilder, private storex: StorexService,
    private userService: UserService

  ) { }

  ngOnInit(): void {
    this.userService.getAllPermissions().subscribe((res) => {
      this.permissions = res;
    })

    this.permissionRegForm();
    if(this.editData){
      this.actionButton="አስተካክል";
      this.permissionForm.controls['name'].setValue(this.editData.name);
      this.permissionForm.controls['amharicName'].setValue(this.editData.amharicName);
      this.permissionForm.controls['createdBy'].setValue(this.storex.getLoginUser());
    }
  }

  permissionRegForm() {
    this.permissionForm = this.fb.group({
      name: ['', Validators.required],
      amharicName: ['', Validators.required],
      createdBy: [this.storex.getLoginUser()]
    })
  }

  addPermission() {
    if (!this.editData) {
      if (this.permissionForm.valid) {
        this.userService.addPermission(this.permissionForm.value).subscribe(
          res => this.handleResponse(res),
          error => this.handleError(error)
        )
      } else {
        this.toastr.error("የተሳሳት መረጃ ግብዓት", "ስህተት");
      }
    }
    else {
      this.updatePermission();
    }
  }

  updatePermission() {
    this.userService.updatePermission(this.permissionForm.value, this.editData.id).subscribe((res) => {
      this.toastr.success(res.msg, res.title)
      this.permissionForm.reset();
      this.dialogRef.close('update');
    },
      (error) => console.log(error))
  }

  handleResponse(data: any) {
    if (data.error) {
      this.toastr.error(data.message, data.title)
    }
    else {
      this.toastr.success(data.message, data.title)
      this.permissionForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/user/permission');

  }
  handleError(error: any) {
    this.toastr.error(error.error.message, error.name)
    this.error = error.error.errors;
  }

  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }

}


