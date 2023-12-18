import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/Services/customer.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { TokenService } from 'src/app/Services/token.service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {

  customerForm!:FormGroup;
  public error='';
  public actionButton:string = "መዝግብ";


  constructor(private customerService: CustomerService,private tokenService:TokenService,
    private router:Router, private fb:FormBuilder, private storex:StorexService,
    @Inject (MAT_DIALOG_DATA) public editData:any, private toastr:ToastrService,
    private dialogRef:MatDialogRef<CustomerCreateComponent>
    ) { }

    ngOnInit(): void {
      this.customerForm = this.fb.group({
        'custName':['', Validators.required],
        'phone':['', [Validators.required, Validators.pattern("^((\\+[0-9]{3}?)|0)?[0-9]{9}$"),
                Validators.maxLength(13),Validators.minLength(10)]],
        'email':[''],
        'address':['', Validators.required],
        'status':[''],
        'createdBy':[this.storex.getLoginUser()]
      })
      if(this.editData){
        this.actionButton="አስተካክል";
        this.customerForm.controls['custName'].setValue(this.editData.custName);
        this.customerForm.controls['phone'].setValue(this.editData.phone);
        this.customerForm.controls['email'].setValue(this.editData.email);
        this.customerForm.controls['address'].setValue(this.editData.address);
        this.customerForm.controls['status'].setValue(true);
        this.customerForm.controls['createdBy'].setValue(this.storex.getLoginUser());

      }
    }

    addCustomer(){
      if(!this.editData){
        if(this.customerForm.valid){
          this.customerService.register(this.customerForm.value).subscribe(
          res=>this.handleResponse(res),
          error=>this.handleError(error)
          )
        }else{
          this.toastr.error("የተሳሳት መረጃ ግብዓት","ስህተት");
        }
      }
      else{
        this.updateCustomer();
      }
    }

    updateCustomer(){
      this.customerService.putCustomer(this.customerForm.value,this.editData.id).subscribe((res)=>{
       this.handleResponse(res)
      },
      (error)=>this.handleError(error))
    }

    handleResponse(data:any){
      if(data.error){
        this.toastr.error(data.message,data.title)
      }
      else{
        this.toastr.success(data.message,data.title)
        this.customerForm.reset();
        this.dialogRef.close('save');
      }
      this.router.navigateByUrl('/customers');

    }
    handleError(error:any){
      this.error =  error.error.errors;
    }

    get phone(){
      return this.customerForm.get('phone');
    }


  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }
}
