import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CheckpointService } from 'src/app/Services/checkpoint.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { StorexService } from 'src/app/Services/storex.service';
import { TokenService } from 'src/app/Services/token.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-checkpoint-create',
  templateUrl: './checkpoint-create.component.html',
  styleUrls: ['./checkpoint-create.component.css']
})
export class CheckpointCreateComponent implements OnInit {

  // public form={
  //   checkPointName:'',
  //   nextRoute:'',
  //   reco:1,
  // }
  public actionButton:string = "መዝግብ";
  public employees:any;
  cpForm!:FormGroup;

  public error='';

  constructor(private cpService: CheckpointService,private tokenService:TokenService,
              private router:Router, private fb:FormBuilder, private storex:StorexService,
              private empService:EmployeeService, private toastr:ToastrService,
              private dialogRef: MatDialogRef<CheckpointCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public editData:any
              ) { }

  ngOnInit(): void {
    this.empService.getEmployeesName().subscribe(res =>{
      this.employees = res;
      // console.log(this.employees);

    },
    error=>
    {
      console.log(error)
    });

    this.cpForm = this.fb.group({
      'checkPointName':['',Validators.required],
      'managedBy':['',Validators.required],
      'remark':[''],
      'createdBy':[this.storex.getLoginUser()]
    })

     console.log(this.editData)
    if(this.editData)
    {
      this.actionButton="አስተካክል";
      this.cpForm.controls['checkPointName'].setValue(this.editData.checkPointName);
      this.cpForm.controls['managedBy'].setValue(this.editData.managedBy);
      this.cpForm.controls['remark'].setValue(this.editData.remark);
      this.cpForm.controls['createdBy'].setValue(this.storex.getLoginUser());
    }

  }
  // addCheckPoint(){
  //   console.log(this.cpForm.value);
  //   this.cpService.register(this.cpForm.value).subscribe(
  //     res=>this.handleResponse(res),
  //     error=>this.handleError(error)

  //     )
  // }
  addCheckPoint(){
  if(!this.editData){
    if(this.cpForm.valid){
      this.cpService.register(this.cpForm.value).subscribe(
      res=>this.handleResponse(res),
      error=>this.handleError(error)
      )
    }else{
      this.toastr.error("የተሳሳት መረጃ ግብዓት","ስህተት");
    }
  }
  else{
    this.updateCheckPoint();
  }
}

updateCheckPoint(){
  console.log(this.editData.id);
  this.cpService.putCheckpoint(this.cpForm.value,this.editData.id).subscribe((res)=>{
    this.toastr.success(res.message,res.title)
    this.cpForm.reset();
    this.dialogRef.close('update');
  },
  (error)=>this.handleError(error))
}


  handleResponse(data:any){
    this.toastr.success(data.message, data.title);
    this.router.navigateByUrl('/checkpoints');
    this.dialogRef.close('save');//this.toastr.info("Add item form closed","Form Close"));
  }
  handleError(error:any){
    this.toastr.error(error.message, error.title)
    this.error = error.message;
  }


  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }
}

