import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorexService } from '../../Services/storex.service';

@Component({
  selector: 'app-reset-password-response',
  templateUrl: './reset-password-response.component.html',
  styleUrls: ['./reset-password-response.component.css']
})
export class ResetPasswordResponseComponent implements OnInit {

  public form={
    email:'',
    password:'',
    confirm_password:'',
    reset_token:''
  }
  public error=''
  constructor(private route: ActivatedRoute, private storexservice:StorexService, private router:Router) {
    this.route.queryParams.subscribe(params =>
      this.form.reset_token = params['token']
    );
  }

  ngOnInit(): void {
  }
  onSubmit(){
    console.log(this.form);
    this.storexservice.changePasssword(this.form).subscribe(
      result=>this.handleResponse(result),
      error => this.handleError(error)
      );

    //console.log(this.form);
  }

  handleResponse(data:any){
      console.log("data : " + data);
      this.router.navigateByUrl('/login');
  }

  handleError(error:any){
    console.log("errorr: "+error);
    this.error=error.error.error;
  }

}
