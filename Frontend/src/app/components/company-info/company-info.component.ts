import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CompanyInfoService } from 'src/app/Services/company-info.service';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { AddCompanyInfoComponent } from './add-company-info.component';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: [],
})
export class CompanyInfoComponent implements OnInit {
  loading: boolean = true;
  error = '';
  companies: any;
  company: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'sno',
    'companyName',
    'ownerName',
    'phone1',
    'address',
    'actions',
  ];
  public dataSource = new MatTableDataSource<any>();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(
    private companyService: CompanyInfoService,
    private sharedService: SharedService,
    private storex: StorexService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }
  openDialog() {
    this.sharedService.openDialog(AddCompanyInfoComponent, this.getAll, {
      height: '420px',
      width: '500px',
    });
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(AddCompanyInfoComponent, this.getAll, {
      height: '420px',
      width: '500px',
      data: data,
    });
  }

  getAll = () => {
    this.companyService.getAll().subscribe(
      (result) => {
        this.dataSource.data = result;
        this.loading = false;
      },
      (error) => {
        this.error = error.error;
        this.loading = false;
      }
    );
  };

  public updateRecord = (data: any) => {
    this.openDialogForEdit(data);
  };
  //get single country information
  public get = (id: number) => {
    this.companyService.get(id).subscribe(
      (res) => {
        this.company = res;
      },
      (error) => console.log(error)
    );
  };
  //delete የሃገርን መረጃ record
  public deleteRecord = (data: any) => {
    // this.getCountry(id);
    if (confirm('የ' + data.name + ' Comany Info መረጃ መሰረዝ ትፈልጋለህ?')) {
      this.companyService.delete(data.id).subscribe(
        (res) => {
          const ctry = res;
          console.log(res);
          //this.toastr.success(ctry.message,ctry.title);
          this.getAll();
        },
        (error) => {
          this.toastr.error(
            'የ' + data.name + ' ሀገር መረጃ አልተሰረዘም፡',
            'ያልተሳካ መሰረዝ'
          );
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
