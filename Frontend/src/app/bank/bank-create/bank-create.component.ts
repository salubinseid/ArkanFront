import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BankService } from 'src/app/Services/bank.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-bank-create',
  templateUrl: './bank-create.component.html',
  styleUrls: ['./bank-create.component.css'],
})
export class BankCreateComponent implements OnInit {
  public actionButton: string = 'መዝግብ';
  public banks: any;
  public bankList :any
  //['ንግድ','አቢሲኒያ','ኦሮሚያ','ኦሮሚያ ህብረት','ህብረት','አባይ','አማራ','ሒጅራ','ዘምዘም','ንብ','ዳሽን','ደቡብ']
  public error = '';
  bankForm!: FormGroup;
  isClicked = false;
  countries = ['ኢትዮጵያ','ጅቡቲ']


  constructor(
    private bankService: BankService,
    private storex: StorexService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BankCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}
  get balance() {
    return this.bankForm.get('balance');
  }
  ngOnInit(): void {
    this.bankService.getBankNames().subscribe((res)=>{
      this.bankList = res;
    })
    this.bankForm = this.fb.group({
      accountOwner: ['', Validators.required],
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      country: [1],
      balance: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ], //

      remark: [''],
      status: [''],
      registerdBy: [''],
    });
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      this.bankForm.controls['bankName'].setValue(this.editData.bankName);
      this.bankForm.controls['accountOwner'].setValue(this.editData.accountOwner);
      this.bankForm.controls['branchName'].setValue(this.editData.branchName);
      this.bankForm.controls['country'].setValue(this.editData.country);
      this.bankForm.controls['accountNumber'].setValue(
        this.editData.accountNumber
      );
      this.bankForm.controls['balance'].setValue(this.editData.balance);
      this.bankForm.controls['status'].setValue(true);
      this.bankForm.controls['remark'].setValue(this.editData.remark);
    }
  }

  addBank() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (!this.editData) {
      if (this.bankForm.valid) {
        this.bankService.register(this.bankForm.value).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateBank();
    }
  }

  updateBank() {
    this.bankService.putBank(this.bankForm.value, this.editData.id).subscribe(
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
      this.bankForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/banks');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error;
    this.toastr.error(error.error);
  }

  //check the acount exist or not
  checkAccount(event: any) {
    const account = event.target.value;
    let result: any;
    this.bankService.isAccountExist(account).subscribe(
      (res) => {
        result = res;
        if (result.exist == 'yes') {
          this.error = result.msg;
          this.toastr.error(result.msg, result.title);
        } else this.toastr.success(result.msg, result.title);
      },
      (error) => console.log(error)
    );
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
