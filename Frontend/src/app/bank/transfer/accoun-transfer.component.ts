import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BankService } from 'src/app/Services/bank.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-accoun-transfer',
  templateUrl: './accoun-transfer.component.html',
  styleUrls: ['./accoun-transfer.component.css'],
})
export class AccounTransferComponent implements OnInit {
  accountTransferForm!: FormGroup;
  error: any;
  accounts: any;
  accountFrom: any;
  accountTo: any;

  constructor(
    private storexService: StorexService,
    private fb: FormBuilder,
    private bankService: BankService,
    private toatser: ToastrService,
    private dialogRef: MatDialogRef<AccounTransferComponent>
  ) {}

  get amount() {
    return this.accountTransferForm.get('amount');
  }
  ngOnInit(): void {
    // this.bankService.getBanksName().subscribe((res)=>{
    //   this.accounts = res;
    //   console.log(this.accounts);
    // })

    this.accountTransferForm = this.fb.group({
      account_from: ['', Validators.required],
      account_to: ['', Validators.required],
      amount: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+(\.\d{1-2})?$/),
        ],
      ],
      registerdBy: [this.storexService.getLoginUser()],
    });
  }

  transferAccount() {
    console.log(this.accountTransferForm.value);
    const from = this.accountTransferForm.controls['account_from'].value;
    const to = this.accountTransferForm.controls['account_to'].value;
    const amt = this.accountTransferForm.controls['amount'].value;
    if (from == to) {
      this.handleError({
        error: {
          message: 'ከሒሳብ እና ወደ ሒሳብ የተመረጡት አካውንቶች የተለያዩ መሆን አለባቸው፡፡',
          title: 'የተሳሳት ግብዓት',
        },
      });
    } else {
      if (this.accountFrom.balance >= amt) {
        if (
          confirm(`${amt} ብር ከሒሳብ ${this.accountFrom.accountNumber} 
            ወደ ሒሳብ ${this.accountTo.accountNumber} ማዘዋወር ትፈልጋለህ?`)
        ) {
          this.bankService
            .traferAccount(this.accountTransferForm.value)
            .subscribe(
              (res) => this.handleResponse(res),
              (err) => this.handleError(err)
            );
        }
      } else {
        this.handleError({
          error: {
            message: 'ለማዘዋውር የተጠየቀውን ያህለ የገንዘብ መጠን በሒሳቡ ውስጥ የለም፡፡',
            title: 'በቂ ሒሳብ የለም፡፡',
          },
        });
      }
    }
  }

  handleResponse(data: any) {
    this.toatser.success(data.message, data.title);
    this.accountTransferForm.reset();
    this.dialogRef.close('save');
  }
  handleError(error: any) {
    this.error = error.error.message;
    this.toatser.error(error.error.message, error.error.title);
  }

  //from selected account info
  selectedFromAccount() {
    const id = this.accountTransferForm.controls['account_from'].value;
    this.bankService.getBank(id).subscribe((res) => (this.accountFrom = res));
  }

  //to selected account info
  selectedToAccount() {
    const id = this.accountTransferForm.controls['account_to'].value;
    this.bankService.getBank(id).subscribe((res) => (this.accountTo = res));
    console.log(this.accountTransferForm.controls['account_to'].value);
  }

  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
