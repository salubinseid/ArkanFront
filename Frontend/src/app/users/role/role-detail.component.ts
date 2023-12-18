import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorexService } from 'src/app/Services/storex.service';
import { UserService } from '../user.service';
import { RoleCreateComponent } from './role-create.component';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.css']
})
export class RoleDetailComponent implements OnInit {

  public role: any;
  public filterData: string = '';
  public permissions: any;
  loading=true;
  error='';

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public displayedColumns =
    ['id', 'permissionName', 'actions' ];
  public dataSource = new MatTableDataSource<any>();

  constructor(private activatedRoute: ActivatedRoute,
      private userService:UserService,
      private sharedServcice:SharedService,
      private storex:StorexService,
      private toastr: ToastrService) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }
  ngOnInit(): void {
    this.loadDetail();
  }

  loadDetail(){
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      let results: any;
      this.userService.getRoleDetail(id).subscribe((res) => {
        console.log(res);
        results = res;
        this.role = results.role;
        this.dataSource.data = results.permissions;
        this.loading=false;
        this.toastr.success(this.role.name + " የሰራተኛው ሚና ዝርዝር በመጫን ላይ", "የሚና ዝርዝር")
      },
        (err) => {
          this.error=err.error;
          this.loading=false;
          this.toastr.error("የሰራተኛው ሚና ዝርዝር አልተጫነም፡፡", "የሚና ዝርዝር");

        }
      );
    });
  }
  deleteRecord(role_id:number, permission_id:number){
    //delete bank record
      if(confirm("Role መሰረዝ ትፈልጋለህ?")) {
        this.userService.deletePermissionFromRole(role_id,permission_id).subscribe((res)=>{
          this.toastr.success(" Role በትክክል ተሰርዟል፡፡","በትክክል መሰረዝ");
          this.loadDetail();
        },
        (error) => {
          this.toastr.error("Role ቁጥሩ አልሰረዘም፡","ያልተሳካ መሰረዝ")

        });
      }
    }

    openDialogForEdit() {
      this.sharedServcice.openDialog(RoleCreateComponent,this.loadDetail,
        {height:'450px',width:'500px',data:this.role });
    }

    hasPermission(val:any){
      return this.storex.hasPermission(val);
    }

}
