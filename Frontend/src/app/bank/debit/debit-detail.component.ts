import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BankService } from 'src/app/Services/bank.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-debit-detail',
  templateUrl: './debit-detail.component.html',
  styleUrls: ['./debit-detail.component.css']
})
export class DebitDetailComponent implements OnInit {

  loading=true;
  error=''  
  info: any;
  public filterData: string = '';
  public transfer: any;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  public displayedColumns =
    ['itemName', 'plateNum', 'salesPrice', 'quantity' ];
  public dataSource = new MatTableDataSource<any>();

  constructor(private activatedRoute: ActivatedRoute, private bankService: BankService,
    private toastr: ToastrService, private storex:StorexService ) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter() {
    this.dataSource.filter = this.filterData.trim().toLocaleLowerCase();
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      let results: any;
      this.bankService.getDebitDetail(id).subscribe((res) => {
        results = res;
        this.info = results.info;
        console.log(results.info)
        this.dataSource.data = results.detail;
        this.loading=false;
        this.toastr.success(results.info.custName + " Debit record is loaded", "Debit Deatil")
      },
        (err) => {
          this.error=err.error;
          this.loading=false;
          this.toastr.error("Debit detail NOT loaded", "Dabit Deatil")
        }
      );
    });
  }

  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }

}

