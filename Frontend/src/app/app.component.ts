import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorexService } from './Services/storex.service';
import { BasketService } from './components/basket/basket.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from './Services/token.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
// import { AppConst } from './constant/AppConst.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn: Observable<boolean>;
  loggedInUser = '';
  public loggedIn = false;
  currentUser$?: Observable<any>;
  currentTime: any;
  public roles: any;
  public totalItem: number = 0;
  // customReportMenus: any[];
  constructor(
    public sorexService: StorexService,
    private router: Router,
    private dialog: MatDialog,
    private basketService: BasketService,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    translate.addLangs(['am', 'en', 'ar']);
    translate.setDefaultLang('am');

    const browserLang = translate.getBrowserLang();

    translate.use(browserLang?.match(/am|en|ar/) ? browserLang : 'am');

    this.isLoggedIn = sorexService.isLoggedIn();
    // this.customReportMenus = [
    //   // { key: 'net', label: 'የተጣራ' },
    //   { key: 'customer', label: 'የደንበኛ' },
    //   // { key: 'item', label: 'የዕቃ' },
    //   { key: 'salesByItem', label: 'የዕቃ ሽያጭ' },
    //   { key: 'salesFrom', label: 'የተሸጠበት ሁኔታ' },
    //   { key: 'purchase', label: 'የዕቃ ግዥ' },
    //   { key: 'transfer', label: 'የተላለፈ' },
    //   { key: 'expense', label: 'ልዩ ልዩ ወጪ' },
    //   { key: 'store', label: 'መጋዘን' },
    // ];
  }
  getLocale(lang) {
    if (lang == 'am') return 'አማ';
    else if (lang == 'ar') return 'عر';
    else return lang;
  }
  ngOnInit(): void {
    this.getCurrentTime();
    if (!this.sorexService.isLoggedIn()) {
      this.sorexService.changeAuthStatus(false);
      this.sorexService.logout();
    } else {
      this.loggedInUser = this.sorexService.getLoginUsername();
      if (this.loggedInUser) {
        this.sorexService.getUserPermission().subscribe((res) => {
          const result = res;
          this.sorexService.permissions.next(result);
        });

        this.sorexService.getUserRoles().subscribe(
          (res: any) => {
            this.roles = res;
          },
          (error: any) => {
            console.log(error);
          }
        );
      }

      this.sorexService.authStatus.subscribe((value) => {
        this.loggedIn = value;
      });
      this.basketService.getItems().subscribe((res) => {
        this.totalItem = res.length;
      });
    }
  }

  // loadReport = (reportType) => {
  //   this.router.navigate(['report/summary', { type: reportType }]);
  // };
  openDialog(user: any) {
    this.dialog
      .open(ChangePasswordComponent, {
        height: '500px',
        width: '480px',
        data: user,
      })
      .afterClosed()
      .subscribe((value) => {});
  }

  logout() {
    this.loggedInUser = '';
    this.sorexService.logout();
    this.toastr.info('ከሲሰትሙ በተሳካ ሁኔታ ለቀዋል፡፡', 'የተጠቃሚ ልየታ');
    this.router.navigateByUrl('/login');
  }

  hasPermission(val: any) {
    return this.sorexService.hasPermission(val);
  }

  getCurrentTime() {
    setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      let hrs = hours < 10 ? `0${hours}` : hours;
      let minutes = now.getMinutes();
      hours;
      let min = minutes < 10 ? `0${minutes}` : minutes;
      let seconds = now.getSeconds();
      let sec = seconds < 10 ? `0${seconds}` : seconds;

      this.currentTime = `${hrs}:${min}:${sec}`;
    }, 1000);
  }
}
