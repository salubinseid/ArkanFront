import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorexService } from 'src/app/Services/storex.service';
import { TokenService } from 'src/app/Services/token.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePWForm!: FormGroup;
  public error = '';
  public un = '';
  public actionButton: string = 'መዝግብ';
  passwordIsValid = false;
  showPassword: boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private fb: FormBuilder,
    private storex: StorexService
  ) {}

  ngOnInit(): void {
    const uname = localStorage.getItem('sorexUsername');
    this.un = uname != null ? uname : '';
    this.changePWForm = this.fb.group({
      username: [this.un],
      old_password: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
    });

    if (this.editData) {
      this.changePWForm.controls['username'].setValue(this.un);
      this.changePWForm.controls['old_password'].setValue('');
    }
  }

  changePassword() {
    const npw = this.changePWForm.get('password')?.value;
    const cpw = this.changePWForm.get('password_confirmation')?.value;
    if (npw === cpw) {
      console.log(this.changePWForm.value);
      this.storex.changePasssword(this.changePWForm.value).subscribe(
        (res) => this.handleResponse(res),
        (error) => this.handleError(error)
      );
    } else {
      this.toastr.error('Entered password not equal', 'Password mismatch');
    }
  }

  handleResponse(data: any) {
    // this.tokenService.handleToken(data.access_token);
    if (data.error) {
      this.toastr.error(data.message, data.title);
    } else {
      this.toastr.success(data.message, data.title);
      this.changePWForm.reset();
      this.dialogRef.close('save');
    }
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error;
  }

  passwordValid(event: any) {
    this.passwordIsValid = event;
  }

  showHidePassword() {
    console.log('hello', this.showPassword);
    this.showPassword = !this.showPassword;
  }
}
