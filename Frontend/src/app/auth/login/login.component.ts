import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorexService } from '../../Services/storex.service';
import { TokenService } from '../../Services/token.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  public form: any = {
    username: '',
    password: '',
  };
  public error = '';
  constructor(
    private myToken: TokenService,
    private router: Router,
    private storex: StorexService,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    var token = this.myToken.isValidToken();
    if (token) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.storex.login(this.form).subscribe(
      (user: any) => {
        if (user) {
          this.storex.loggedIn.next(true);
          localStorage.setItem('token', user.access_token);
          this.storex.setUser(user.user);
          this.storex.getUserPermission().subscribe((res) => {
            const result = JSON.stringify(res);
            localStorage.setItem('permissions', result);
          });
        }
        this.handleResponse();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  handleResponse() {
    // this.myToken.handleToken(data.access_token);
    // this.storex.setUser(data.user);
    // this.storex.changeAuthStatus(true);
    // localStorage.setItem('sorexUsername', this.form.username);
    this.router.navigateByUrl('/dashboard');
    // const user = this.storex.getCurrentUserValue();
    // this.storex.getUserPermission().subscribe((res)=>{
    //   console.log(res);
    //    const result = JSON.stringify(res);
    //    localStorage.setItem('permissions',result);
    //  })

    // console.log(data);
    this.toastr.success('ወደ ሲሰትሙ በተሳካ ሁኔታ ገብተዋል፡፡', 'የተጠቃሚ ልየታ');
    this.router.navigateByUrl('/dashboard');
  }
  handleError(error: any) {
    this.toastr.error(error.error.error, error.statusText);

    // this.error = error.error.error;
    // this.toastr.error(this.error,"Login Error");
  }
  logout() {
    this.myToken.removeToken();
    this.toastr.error('ከሲሰትሙ በተሳካ ሁኔታ ለቀዋል፡፡', 'የተጠቃሚ ልየታ');
    this.router.navigateByUrl('/login');
  }
}
