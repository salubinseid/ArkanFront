import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../Services/country.service';
import { SharedService } from '../../Services/shared.service';
import { StorexService } from '../../Services/storex.service';
import { AddCountryComponent } from './add-country.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements OnInit {
  loading: boolean = true;
  error = '';
  countries: any;
  country: any;

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
    private countryService: CountryService,
    private sharedService: SharedService,
    private storex: StorexService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllCountries();
  }
  openDialog() {
    this.sharedService.openDialog(AddCountryComponent, this.getAllCountries, {
      height: '400px',
      width: '450px',
    });
  }
  openDialogForEdit(data: any) {
    this.sharedService.openDialog(AddCountryComponent, this.getAllCountries, {
      height: '400px',
      width: '450px',
      data: data,
    });
  }

  getAllCountries = () => {
    this.countryService.getAll().subscribe(
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
  public getCountry = (id: number) => {
    this.countryService.get(id).subscribe(
      (res) => {
        this.country = res;
      },
      (error) => console.log(error)
    );
  };
  //delete የሃገርን መረጃ record
  public deleteRecord = (data: any) => {
        // this.getCountry(id);
    if (confirm('የ' + data.name + ' ሀገርን መረጃ መሰረዝ ትፈልጋለህ?')) {
      this.countryService.delete(data.id).subscribe(
        (res) => {
          const ctry = res;
          this.toastr.success(ctry.message, ctry.title);
          this.getAllCountries();
        },
        (error) => {
          this.toastr.error('የ' + data.name + ' ሀገር መረጃ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
