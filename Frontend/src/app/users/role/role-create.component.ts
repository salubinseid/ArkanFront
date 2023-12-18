import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorexService } from 'src/app/Services/storex.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.css']
})
export class RoleCreateComponent implements OnInit {

  public actionButton: string = "መዝግብ";
  roleForm!: FormGroup;
  error = '';
  roles: any
  permissions: any = [];
  constructor(private router: Router, private toastr: ToastrService,
    private dialogRef: MatDialogRef<RoleCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private fb: FormBuilder, private storex: StorexService,
    private userService: UserService

  ) { }

  ngOnInit(): void {

    this.userService.getAllRoles().subscribe((res) => {
      this.roles = res;
    })

    this.userService.getAllPermissions().subscribe((res) => {
      this.permissions = res.permissions;
    })

    this.roleRegForm();
    if(this.editData){
      //console.log(">>>>>>>>",this.editData.id)
      // getUnassignedPermissions
      this.userService.getAllPermissions().subscribe((res) => {
        this.permissions = res.permissions;
      })
      this.actionButton="አስተካክል";
      this.roleForm.controls['name'].setValue(this.editData.name);
      this.roleForm.controls['createdBy'].setValue(this.storex.getLoginUser());
    }

  }

  roleRegForm() {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      permissions: [this.permissions, Validators.required],
    })
  }

  addRole() {
    if (!this.editData) {
      if (this.roleForm.valid) {
        this.userService.addRole(this.roleForm.value).subscribe(
          res => this.handleResponse(res),
          error => this.handleError(error)
        )
      } else {
        this.toastr.error("የተሳሳት መረጃ ግብዓት", "ስህተት");
      }
    }
    else {
      this.updateRole();
    }
  }

  updateRole() {
    console.log(this.roleForm.value)
    this.userService.updateRole(this.roleForm.value, this.editData.id).subscribe((res) => {
      this.toastr.success(res.msg, res.title)
      this.roleForm.reset();
      this.dialogRef.close('update');
    },
      (error) => console.log(error))
  }


  handleResponse(data: any) {
    console.log(data);
    if (data.error) {
      this.toastr.error(data.msg, data.title)
    }
    else {
      this.toastr.success(data.msg, data.title)
      this.roleForm.reset();
      this.dialogRef.close('save');
    }
    // this.router.navigateByUrl('/user/role');

  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }

}
