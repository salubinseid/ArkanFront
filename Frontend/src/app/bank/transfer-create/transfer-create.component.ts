import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BankService } from 'src/app/Services/bank.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorexService } from 'src/app/Services/storex.service';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-transfer-create',
  templateUrl: './transfer-create.component.html',
  styleUrls: ['./transfer-create.component.css'],
})
export class TransferCreateComponent implements OnInit {
  public actionButton: string = 'መዝግብ';

  transferForm!: FormGroup;
  public accounts: any;
  selectedFile: string = '';
  imgUrl: any;
  public error = '';
  customers: any;
  public fileData: any = [];
  images: string[] = [];
  currencyFormat: any;

  constructor(
    private bankService: BankService,
    private router: Router,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<TransferCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private fb: FormBuilder,
    private storex: StorexService,
    private http: HttpClient,
    private custService: CustomerService
  ) {}

  ngOnInit(): void {
    // this.bankService.getBanksName().subscribe((res) => {
    //   this.accounts = res;
    // });

    // this.custService.getCustomersName().subscribe((res) => {
    //   this.customers = res;
    // });

    this.transferForm = this.fb.group({
      // bank_id: ['', Validators.required],
      // inOut: ['', Validators.required],
      amount: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      // [
      //   Validators.required,
      //   Validators.maxLength(15),
      //   Validators.pattern(/^\d+(\.\d{1-2})?$/),
      // ],],
      transferTo: [''],
      reason: [''],
      status: [''],
      // image: [''],
      createdBy: [this.storex.getLoginUser()],
    });
    if (this.editData) {
      this.actionButton = 'አስተካክል';
      // this.transferForm.controls['bank_id'].setValue(this.editData.bank_id);
      // this.transferForm.controls['inOut'].setValue(this.editData.inOut);
      this.transferForm.controls['amount'].setValue(this.editData.amount);
      this.transferForm.controls['transferTo'].setValue(
        this.editData.processedBy
      );
      this.transferForm.controls['status'].setValue(true);
      this.transferForm.controls['reason'].setValue(this.editData.reason);
    }
  }

  makeCommaFormat() {
    this.currencyFormat = this.transferForm.value.amount;
  }

  // selectFileUpload(event:any){
  //   for  (var i =  0; i <  event.target.files.length; i++)  {
  //     this.fileData.push(event.target.files[i]);
  //     this.selectedFile += (this.fileData[i].name) + ", ";

  // }
  //   this.selectedFile = this.selectedFile.replace(/,\s*$/, "");
  //   // this.fileData = event.target.files[0];
  //   let reader =  new FileReader();
  //   reader.readAsDataURL(this.fileData);
  //   reader.onload = (e)=>{
  //     thiSs.imgUrl = reader.result;
  //   }
  // }

  // selectFileUpload(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     var filesAmount = event.target.files.length;
  //     for (let i = 0; i < filesAmount; i++) {
  //       var reader = new FileReader();
  //       reader.onload = (event: any) => {
  //         // Push Base64 string
  //         this.images.push(event.target.result);
  //         this.transferForm.patchValue({
  //           fileSource: this.images,
  //         });
  //       };
  //       reader.readAsDataURL(event.target.files[i]);
  //     }
  //   }
  // }

  addTransfer() {
    // console.log("======================")
    // console.log(this.transferForm.value);
    // console.log("======================")
    // console.log(this.images)
    if (!this.editData) {
      if (this.transferForm.valid) {
        var myFormData = new FormData();
        // const amt = (this.transferForm.value.amount).replace(/\,/g,'');
        // myFormData.append('image', this.transferForm.value.image);
        // myFormData.append('bank_id', this.transferForm.value.bank_id);
        myFormData.append('amount', this.transferForm.value.amount);
        myFormData.append('transferTo', this.transferForm.value.transferTo);
        // myFormData.append('inOut', this.transferForm.value.inOut);
        myFormData.append('reason', this.transferForm.value.reason);
        myFormData.append('createdBy', this.storex.getLoginUser());
        console.log(myFormData);
        this.bankService.transfer(myFormData).subscribe(
          (res) => this.handleResponse(res),
          (error) => this.handleError(error)
        );
      } else {
        this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
      }
    } else {
      this.updateTransfer();
    }
  }

  updateTransfer() {
    if (this.transferForm.valid) {
      var myFormData = new FormData();
      // myFormData.append('image', this.fileData);
      // myFormData.append('bank_id', this.transferForm.value.bank_id);
      myFormData.append('amount', this.transferForm.value.amount);
      myFormData.append('transferTo', this.transferForm.value.transferTo);
      // myFormData.append('inOut', this.transferForm.value.inOut);
      myFormData.append('reason', this.transferForm.value.reason);
      myFormData.append('createdBy', this.storex.getLoginUser());
      this.bankService
        .putTransfer(myFormData, this.editData.id)
        .subscribe((res) => {
          this.toastr.success(res.message, res.title);
          this.transferForm.reset();
          this.dialogRef.close('update');
        });
    } else {
      this.toastr.error('የተሳሳት መረጃ ግብዓት', 'ስህተት');
    }
  }

  handleResponse(data: any) {
    if (data.error) {
      this.toastr.error(data.message, data.title);
    } else {
      this.toastr.success(data.message, data.title);
      this.transferForm.reset();
      this.dialogRef.close('save');
    }
    this.router.navigateByUrl('/transfers');
  }
  handleError(error: any) {
    console.log(error);
    this.error = error.error.errors;
  }

  get amount() {
    return this.transferForm.get('amount');
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
