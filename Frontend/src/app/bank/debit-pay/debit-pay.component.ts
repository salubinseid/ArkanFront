import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BankService } from 'src/app/Services/bank.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-debit-pay',
  templateUrl: './debit-pay.component.html',
  styleUrls: ['./debit-pay.component.css'],
})
export class DebitPayComponent implements OnInit {
  public actionButton: string = 'መዝግብ';
  boxStatus = true;

  debitForm!: FormGroup;
  public accounts: any;
  selectedFile!: any;
  imgUrl: any;
  public error = '';
  customers: any;

  public fileData: any;
  remainAmount = 0;
  grandTotal = 0;
  isClicked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private custService: CustomerService,
    private bankService: BankService,
    private dialogRef: MatDialogRef<DebitPayComponent>,
    private storex: StorexService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.custService.getCustomersName().subscribe((res) => {
      this.customers = res;
    });

    // this.bankService.getBanksName().subscribe((res) => {
    //   this.accounts = res;
    // });

    this.debitForm = this.fb.group({
      customer_id: ['', Validators.required],
      bank_id: ['', Validators.required],
      paidAmount: ['', Validators.required],
      remainAmount: [this.remainAmount],
      image: ['', Validators.required],
      remark: [''],
      // 'items':[this.basketService.cartItems,Validators.required],
    });
    if (this.editData) {
      // this.actionButton="አስተካክል";
      this.customers = this.editData;
      this.debitForm.controls['customer_id'].setValue(
        this.editData.customer_id
      );
      this.debitForm.controls['paidAmount'].setValue(
        this.editData.remainAmount
      );
      this.grandTotal = this.editData.remainAmount;
    }
  }

  //calculate remain amount
  calculateRemainAmount(event: any) {
    this.remainAmount = this.grandTotal - event.target.value;

    let msg = '';
    if (this.remainAmount < 0)
      msg = 'ከክፍያው መጠን ( ' + this.grandTotal + ' ) በላይ ነው ያስገባኸውና፤ !';
    if (this.remainAmount > 0) msg += '===> ቀሪ ክፍያ = ' + this.remainAmount;
    if (msg != '') alert(msg);
    // if(this.remainAmount<0)
    //   alert("ከክፍያው መጠን ( " + this.grandTotal +" ) በላይ ነው ያስገባኸውና፤ እንደገና አስገባ!")
    // else if(this.remainAmount>0)
    //   alert("ቀሪ ክፍያ = "+this.remainAmount);
  }
  selectFileUpload(event: any) {
    this.fileData = event.target.files[0];
    this.selectedFile = this.fileData.name;

    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (e) => {
      this.imgUrl = reader.result;
    };
  }

  payDebit() {
    this.isClicked = true;
    setTimeout(() => {
      console.log();
    }, 1000);
    if (this.debitForm.valid) {
      var myFormData = new FormData();
      myFormData.append('id', this.editData.id);
      myFormData.append('image', this.fileData);
      myFormData.append('customer_id', this.debitForm.value.customer_id);
      myFormData.append('bank_id', this.debitForm.value.bank_id);
      myFormData.append('paidAmount', this.debitForm.value.paidAmount);
      myFormData.append('remainAmount', this.remainAmount.toString());
      // myFormData.append('id',this.debitForm.valid.id);
      myFormData.append('remark', this.debitForm.value.remark);
      myFormData.append('createdBy', this.storex.getLoginUser());

      console.log(this.debitForm.value);
      this.bankService.payDebit(myFormData).subscribe(
        (res) => this.handleResponse(res),
        (error) => this.handleError(error)
      );
    } else {
      this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
    }
  }

  handleResponse(data: any) {
    if (data.error) {
      this.toastr.error(data.message, data.title);
      this.router.navigateByUrl('/basket');
    } else {
      this.toastr.success(data.message, data.title);
      this.toastr.success('ክፍያው ወደ ባንክ ሂሳብ ገቢ ተደርጓል፡፡', 'ገቢ ሂሳብ');

      this.debitForm.reset();
      this.router.navigateByUrl('/debits');
      this.dialogRef.close('save');
    }
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
