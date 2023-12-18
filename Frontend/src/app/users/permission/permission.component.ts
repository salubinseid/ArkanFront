import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { UserService } from '../user.service';
import { PermissionCreateComponent } from './permission-create.component';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
})
export class PermissionComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false }) paginator!: MatPaginator;

  public filterData:string='';
  public displayedColumns =
  ['id','name', 'amharicName','actions'];
  public dataSource = new MatTableDataSource<any>();
  loading=true;
  error='';
  bank:any;
  transactions:any;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter(){
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(
      private userService: UserService,private router:Router,
      private storex:StorexService, private toastr:ToastrService, private sharedService:SharedService

     )
     { }

  ngOnInit() {
    this.getAllPermissions();
  }

  openDialog() {
    this.sharedService.openDialog(PermissionCreateComponent,this.getAllPermissions,{height:'300px', width:'500px'})
  }
  openDialogForEdit(data:any) {
    this.sharedService.openDialog(PermissionCreateComponent,this.getAllPermissions,
        {height:'300px', width:'500px',data:data})

  }

  public getAllPermissions = () => {
    this.userService.getAllPermissions()
    .subscribe(res => {
      this.dataSource.data = res.permissions;
      this.loading=false;
      this.toastr.success(res.msg,res.title);

    },
    (error)=>{
      this.error = error.error;
      this.loading=false;
      this.toastr.error(error.error.msg,error.error.title);
    })
  }

  //get single permission account information
  public getPermission = (id:number) =>{
    this.userService.getPermission(id).subscribe(res=>{
      this.bank = res;
    },
    error=> console.log(error))
  }

  public updateRecord = (data: any) => {
    // this.getBank(id);
    this.openDialogForEdit(data);
  }

  //delete bank record
  public deleteRecord = (id: number) => {
    this.getPermission(id);
    if(confirm("ፈቃዱን መሰረዝ ትፈልጋለህ?")) {
      this.userService.deletePermission(id).subscribe((res)=>{
        this.toastr.success(" ፈቃዱን በትክክል ተሰርዟል፡፡","በትክክል መሰረዝ");
        this.getAllPermissions();
      },
      (error) => {
        this.toastr.error("ፈቃዱን አልተሰረዘም፡","ያልተሳካ መሰረዝ")

      });
    }
  }

  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }
}
