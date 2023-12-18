import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadService } from 'src/app/Services/load.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-load-detail',
  templateUrl: './load-detail.component.html',
  styleUrls: ['./load-detail.component.css'],
})
export class LoadDetailComponent implements OnInit {
  load: any;
  public filterData: string = '';
  loading = true;
  error = '';

  public displayedColumns = ['id', 'amount', 'inOut', 'reason', 'custName'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private storex: StorexService,
    private loadService: LoadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let results;
    this.activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      this.loadService.getLoadDetail(id).subscribe(
        (res) => {
          this.load = res[0];
          console.log(res);
          this.loading = false;
          this.toastr.success(
            this.load.itemName + ' Item load detail is loaded',
            'Load Deatil'
          );
        },
        (err) => {
          this.error = err.error;
          this.loading = false;
          this.toastr.error('Item load detail NOT loaded', 'Load Deatil');
        }
      );
    });
  }

  hasPermission(val: any) {
    return this.storex.hasPermission(val);
  }
}
