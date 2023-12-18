import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.css']
})
export class ResetPasswordRequestComponent implements OnInit {

  public form={
    email:null

  }
  public error="";
  constructor(private storexService:StorexService, private router:Router, 
    // private toaster:ToastrService
    ) { }

  ngOnInit(): void {
  }
  onSubmit(){
    console.log(this.form.email);
    this.storexService.sendPWResetLink(this.form).subscribe(
      result => this.handleResponse(result),
      error => this.handleError(error)
    );
  }
  handleResponse(data:any){
    console.log(data);
    // this.toaster.success("Password reset link sent to your email successfuly ","Reset");
    this.router.navigateByUrl('reset-password-response');
  }

  handleError(error:any){
    this.error= error.error.error;
    // this.toaster.error("Password reset request failed ","Reset");

  }

}
