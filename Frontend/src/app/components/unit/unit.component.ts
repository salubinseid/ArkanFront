import { AddUnitComponent } from './add-unit.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/Services/shared.service';
import { StorexService } from 'src/app/Services/storex.service';
import { UnitService } from 'src/app/Services/unit.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  loading: boolean = true;
  error = '';
  units: any;
  unit: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = [
    'sno',
    'name',
    'description',
    'updated_at',
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
    private unitSerivice: UnitService,
    private sharedService: SharedService,
    private storex: StorexService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllUnits();
  }
  openDialog() {
    this.sharedService.openDialog(AddUnitComponent, this.getAllUnits, {
      height: '400px',
      width: '450px',
    });
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(AddUnitComponent, this.getAllUnits, {
      height: '400px',
      width: '450px',
      data: data,
    });
  }

  getAllUnits = () => {
    this.unitSerivice.getAll().subscribe(
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
  public getUnit = (id: number) => {
    this.unitSerivice.get(id).subscribe(
      (res) => {
        this.unit = res;
      },
      (error) => console.log(error)
    );
  };
  //delete የሃገርን መረጃ record
  public deleteRecord = (data: any) => {
        // this.getCountry(id);
    if (confirm('የ' + data.name + ' የሚለወን የዕቃ መለኪያ መሰረዝ ትፈልጋለህ?')) {
      this.unitSerivice.delete(data.id).subscribe(
        (res) => {
          const ctry = res;
          this.toastr.success(ctry.message, ctry.title);
          this.getAllUnits();
        },
        (error) => {
          this.toastr.error('የዕቃ መለኪያው አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
