import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { LoadService } from 'src/app/Services/load.service';
import { MedareshaService } from 'src/app/Services/medaresha.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-medaresha',
  templateUrl: './medaresha.component.html',
  styleUrls: ['./medaresha.component.css']
})
export class MedareshaComponent implements OnInit {

  loading: boolean = true;
  error = '';
  medareshas: any;
  medaresha: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public filterData: string = '';
  public displayedColumns = ['checkPointName', 'unitTariff'];
  public dataSource = new MatTableDataSource<any>();
  currentLoadId: any;
  loadMedareshaTariff: any;
  tariff: any;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }

  constructor(
    private medareshaService: MedareshaService,
    private storex: StorexService,
    private toastr: ToastrService,
    private loadService: LoadService,
    private dialogRef: MatDialogRef<MedareshaComponent>,

    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.getAllMedareshas();
    if (this.editData) {
      this.medareshaService
        .getLoadMedaresha(this.editData.id)
        .subscribe((res) => {
          this.loadMedareshaTariff = res;
        });
      this.currentLoadId = this.editData.id;
    }
    // console.log('Loaded Id =>', this.currentLoadId);
  }
  // openDialog() {
  //   this.sharedService.openDialog(AddCountryComponent, this.getAllMedareshas, {
  //     height: '400px',
  //     width: '450px',
  //   });
  // }
  // openDialogForEdit(data: any) {
  //   this.sharedService.openDialog(AddCountryComponent, this.getAllMedareshas, {
  //     height: '400px',
  //     width: '450px',
  //     data: data,
  //   });
  // }

  closeModal() {
    this.dialogRef.close('save');
  }

  getAllMedareshas = () => {
    this.medareshaService.getAll().subscribe(
      (result) => {
        this.dataSource.data = result.filter((c)=>c.checkPointName !=='ጅቡቲ');
        this.loading = false;
      },
      (error) => {
        this.error = error.error;
        this.loading = false;
      }
    );
  };

  // public updateRecord = (data: any) => {
  //   this.openDialogForEdit(data);
  // };
  //get single country information
  public getMedaresha = (id: number) => {
    this.medareshaService.get(id).subscribe(
      (res) => {
        this.medaresha = res;
        this.tariff = this.medaresha.unitTariff;
      },
      (error) => console.log(error)
    );
  };

  public getMedareshaTariff = (id: number) => {
    this.medareshaService.getMedareshTariff(id, this.currentLoadId).subscribe(
      (res) => {
        this.medaresha = res;
        this.tariff = this.medaresha.unitTariff;
      },
      (error) => console.log(error)
    );
  };
  //delete የሃገርን መረጃ record
  public deleteRecord = (data: any) => {
    // this.getMedaresha(id);

    if (confirm('የ' + data.medaresha + ' ሀገርን መረጃ መሰረዝ ትፈልጋለህ?')) {
      this.medareshaService.delete(data.id).subscribe(
        (response) => {
          const result = response;
          this.toastr.success(result.message, result.title);
          this.getAllMedareshas();
        },
        (error) => {
          this.toastr.error('መጋዘኑ አልተሰረዘም፡', 'ያልተሳካ መሰረዝ');
        }
      );
    }
  };

  updateMedareshTariff(id: number, event: any) {
    //const loadId = this.medareshaForm.controls['load_id'].value;
    //const medareshaId = this.medareshaForm.controls['medareshaId'].value;
    // console.log(
    //   'While update Loaded Id =>',
    //   this.currentLoadId,
    //   '===========>',
    //   id
    // );
    const price = event.target.value;
    const formData = new FormData();
    formData.append('unitTariff', price);
    formData.append('medareshaId', id.toString());
    formData.append('load_id', this.currentLoadId);
    formData.append('createdBy', this.storex.getLoginUser());

    this.loadService.updateMedareshTariff(formData, id).subscribe(
      (res) => {
        this.toastr.success(res.message, res.title);
      },
      (err) => this.toastr.error(err.message, err.title)
    );
  }

  //update loading unit tariff of single item
  setLoadTariff(id: number, event: any) {
    const price = event.target.value;
    const formData = new FormData();
    formData.append('unitTariff', price);
    this.loadService.updateLoadTariff(id, formData).subscribe(
      (res: any) => {
        // this.getAllLoads();
        this.toastr.success(res.message, res.title);
      },
      (err) => this.toastr.error(err.message, err.title)
    );
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
