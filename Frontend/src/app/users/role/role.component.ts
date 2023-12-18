import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { UserService } from '../user.service';
import { RoleAssignComponent } from './role-assign.component';
import { RoleCreateComponent } from './role-create.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    @ViewChild(MatPaginator, {static: false }) paginator!: MatPaginator;

    public filterData:string='';
    public displayedColumns =
    ['id','name', 'actions'];
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
        private storex:StorexService,
        private toastr:ToastrService,
        private sharedServcice:SharedService

       )
       { }

    ngOnInit() {
      this.getAllRoles();
    }

    openDialog() {
      this.sharedServcice.openDialog(RoleCreateComponent,this.getAllRoles,
        {height:'450px',width:'500px'});
    }

    openAssignDialog(){
      this.sharedServcice.openDialog(RoleAssignComponent,this.getAllRoles,
        {height:'450px',width:'500px'});
    }

    openDialogForEdit(data:any) {
      this.sharedServcice.openDialog(RoleCreateComponent,this.getAllRoles,
        {height:'450px',width:'500px',data:data});
    }

    public getAllRoles = () => {
      this.userService.getAllRoles().subscribe(res => {
        this.dataSource.data = res.data;
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
    public getRole = (id:number) =>{
      this.userService.getRole(id).subscribe(res=>{
        this.bank = res;
      },
      error=> console.log(error))
    }
    public viewDetail = (id: number) => {
      this.router.navigate(['users/roles/detail',{id:id}]);
    }

    //delete bank record
    public deleteRecord = (data: any) => {
      // this.getRole(id);

      if(confirm("የ "+data.name+ "ሚናውን ፈቃድ መሰረዝ  ትፈልጋለህ?")) {
        this.userService.deletePermission(data.id).subscribe((res)=>{
          this.toastr.success("የ "+data.name+ " ሚናው ፈቃድ በትክክል ተሰርዟል፡፡","በትክክል መሰረዝ");
          this.getAllRoles();
        },
        (error) => {
          this.toastr.error("የ "+data.name+ " ሚናውን ፈቃድ አልተሰረዘም፡","ያልተሳካ መሰረዝ")

        });
      }
    }

    hasPermission(val:any){
      return this.storex.hasPermission(val);
    }

  }

