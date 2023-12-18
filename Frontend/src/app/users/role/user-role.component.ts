import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { UserService } from '../user.service';
import { RoleAssignComponent } from './role-assign.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css'],
})
export class UserRoleComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'id',
    'fullName',
    'username',
    'roleName',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();
  loading = true;
  error = '';
  bank: any;
  transactions: any;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(
    private userService: UserService,
    private storex: StorexService,
    private toastr: ToastrService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getAllUsersWithRoles();
  }
  openAssignDialog() {
    this.sharedService.openDialog(
      RoleAssignComponent,
      this.getAllUsersWithRoles,
      { height: '450px', width: '550px' }
    );
  }

  public getAllUsersWithRoles = () => {
    this.userService.getAllUsersWithRoles().subscribe(
      (res) => {
        this.dataSource.data = res.data;

        this.loading = false;
        this.toastr.success(res.msg, res.title);
      },
      (error) => {
        console.log(error);
        this.error = error.error;
        this.loading = false;
        this.toastr.error(error.error.msg, error.error.title);
      }
    );
  };

  //get single permission account information
  public getRole = (id: number) => {
    this.userService.getRole(id).subscribe(
      (res) => {
        this.bank = res;
      },
      (error) => console.log(error)
    );
  };
  public viewDetail = (uid: number, rid: number) => {
    // this.router.navigate(['users/roles/detail', { uid: uid, rid:rid }]);
  };

  //delete record
  public deleteRecord = (data: any, rid: number) => {
    if (confirm('የተጠቃሚውን ' + data.name + ' የሲስተም ሚና መሰረዝ ትፈልጋለህ?')) {
      this.userService.deleteUserRole(data.id, rid).subscribe(
        (res) => {
          this.toastr.success(
            ' የተጠቃሚው ' + data.name + ' የሲስተም ሚና በትክክል ተሰርዟል፡፡',
            'በትክክል መሰረዝ'
          );
          this.getAllUsersWithRoles();
        },
        (error) => {
          this.toastr.error('የተጥቃሚው የሲስተም ሚና ቁጥሩ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
