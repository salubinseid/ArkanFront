import { EmployeeService } from './../Services/employee.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { EmployeeCreateComponent } from '../employee-create/employee-create.component';
import { SharedService } from '../Services/shared.service';
import { StorexService } from '../Services/storex.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  loading: boolean = true;
  error = '';
  public employee: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns =
    ['SNo','fullName','username','country', 'phone', 'email',  'role', 'actions'];
  public dataSource = new MatTableDataSource<any>();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(private empService: EmployeeService, private storex:StorexService,
    private shared: SharedService, private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllEmployees();

  }

  getAllEmployees = () =>{

    this.empService.getAllEmployees().subscribe(
      res => {
        this.dataSource.data = res;
        this.loading = false;
      },
      (err) => {
        this.error = err.error;
        this.loading = false;
      }
    )
  }

  openDialog() {
    this.shared.openDialog(EmployeeCreateComponent, this.getAllEmployees, { height:'500px', width:'850px'});
  }
  openDialogForEdit(data: any) {
    this.shared.openDialog(EmployeeCreateComponent, this.getAllEmployees, { height: '500px', width: '850px', data })
  }


  viewDetail(id: any) {
  }

  //get single employee account information
  public getEmployee = (id: number) => {
    this.empService.getEmployee(id).subscribe(res => {
      this.employee = res;
    },
      error => console.log(error))
  }

  public updateRecord = (data: any) => {
    // this.getEmployee(id);
    this.openDialogForEdit(data);
  }

  //delete employee record
  public deleteRecord = (data: any) => {
    this.getEmployee(data.id);

    if (confirm('የ' + data.fullName + " የሒሳብ ቁጥሩን መሰረዝ ትፈልጋለህ?")) {
      this.empService.deleteEmployee(data.id).subscribe((res) => {
        this.toastr.success('የ' + data.fullName +
          " የሒሳብ ቁጥር በትክክል ተሰርዟል፡፡", "በትክክል መሰረዝ");
        this.getAllEmployees();
      },
        (error) => {
          this.toastr.error("የሒሳብ ቁጥሩ አልሰረዘም፡", "ያልተሳካ መሰረዝ")

        });
    }
  }

  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }

}
