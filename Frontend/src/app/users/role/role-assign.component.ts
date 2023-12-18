import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/Services/employee.service';
import { StorexService } from 'src/app/Services/storex.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-role-assign',
  templateUrl: './role-assign.component.html',
  styleUrls: ['./role-assign.component.css']
})
export class RoleAssignComponent implements OnInit {

  public actionButton: string = "መዝግብ";
  assignRoleForm!: FormGroup;
  error = '';
  roles: any
  employees: any = [];
  constructor(private router: Router, private toastr: ToastrService,
    private dialogRef: MatDialogRef<RoleAssignComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private fb: FormBuilder, private storex: StorexService,
    private userService: UserService,
    private empService: EmployeeService

  ) { }

  ngOnInit(): void {
    this.userService.getRoleNames().subscribe((res) => {
      this.roles = res.data;
    })
    this.empService.getEmployeesName().subscribe((res) => {
      this.employees = res;
    })
    this.assignRoleRegForm();

  }

  assignRoleRegForm() {
    this.assignRoleForm = this.fb.group({
      employees: [this.employees, Validators.required],
      roles: [this.roles, Validators.required],
    })
  }

  assignRoleToEmployee() {
    if (!this.editData) {
      if (this.assignRoleForm.valid) {
        this.userService.assignEmployeeRole(this.assignRoleForm.value).subscribe(
          res => this.handleResponse(res),
          error => this.handleError(error)
        )
      } else {
        this.toastr.error("የተሳሳት መረጃ ግብዓት", "ስህተት");
      }
    }
    // else {
    //   this.updateRole();
    // }
  }

  // updateRole() {
  //   this.userService.updateRole(this.assignRoleForm.value, this.editData.id).subscribe((res) => {
  //     this.toastr.success(res.msg, res.title)
  //     this.assignRoleForm.reset();
  //     this.dialogRef.close('update');
  //   },
  //     (error) => console.log(error))
  // }


  handleResponse(data: any) {
    console.log(data);
    if (data.error) {
      this.toastr.error(data.msg, data.title)
    }
    else {
      this.toastr.success(data.msg, data.title)
      this.assignRoleForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/users/role-list');

  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }
  
}
