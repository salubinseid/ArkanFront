import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BankService } from 'src/app/Services/bank.service';
import { StorexService } from 'src/app/Services/storex.service';

@Component({
  selector: 'app-transfer-detail',
  templateUrl: './transfer-detail.component.html',
  styleUrls: ['./transfer-detail.component.css']
})
export class TransferDetailComponent implements OnInit {

  transfer:any;
  constructor( private activatedRoute:ActivatedRoute, private toastr:ToastrService,
    private bankService:BankService, private storex:StorexService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.bankService.getTransferDetail(id).subscribe((res:any) => {
        this.transfer = res;
        console.log(this.transfer.bankName);
        this.toastr.success(this.transfer.accountNumber + " Transfer detail is loaded", "Transfer Deatil")
      },
        (err) => this.toastr.error("Transfer detail NOT loaded", "Transfer Deatil")
      );
    });
  }

  
  hasPermission(val:any){
    return this.storex.hasPermission(val);
  }

}
