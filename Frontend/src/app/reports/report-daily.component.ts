import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from './report.service';
import { StorexService } from '../Services/storex.service';

@Component({
  selector: 'app-report-daily',
  templateUrl: './report-daily.component.html',
  styleUrls: ['./report-custom.component.css']

})
export class ReportDailyComponent implements OnInit {
  dailyReportForm!: FormGroup;
  summary: any;
  myDate = {
    from: new Date(),
    to: new Date()
  }
  public dataSource = new MatTableDataSource<any>();

  columnHeaders = [
    { name: 'created_at', label: 'ቀን' },
    { name: 'netSoldPrice', label: 'ጠ/ሸያጭ' },
    { name: 'netTransportPrice', label: 'ጠ/የትራንስፖርት' },
    { name: 'netDriverLoan', label: 'ጠ/ሹፌር ወጪ' },
    { name: 'netTranportExpense', label: 'ጠ/ጉዞ ወጪ' },
    { name: 'net', label: 'የተጣራ' },
  ];
  displayedColumns = this.columnHeaders.map((col) => col.name);


  constructor(private fb:FormBuilder, private reportService:ReportService, private storexService:StorexService) { }

  ngOnInit(): void {
    let now = new Date();
    let monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    this.dailyReportForm = this.fb.group({
      category: ['', Validators.required],
      startDate: [now],
      endDate:[now],
    });
    this.loadReport();
  }

  loadReport = () => {
    setTimeout(() => {
      console.log();
    }, 1000);
    this.myDate.from = this.dailyReportForm.controls['startDate'].value;
    this.myDate.to = this.dailyReportForm.controls['endDate'].value;

    console.log(this.dailyReportForm.value)


    this.reportService
        .getDailyReport(this.dailyReportForm.value)
        .subscribe((res) => {
          // console.log("Dauly Report: ", res)
          this.summary = res;
          // this.summary.map((m)=>{
          //   this.getExpense(m.created_at).subscribe((r)=>{
          //     if(r.length>0)
          //      this.dataSource.data['expense'] =  r.expense;
          //   })
          //   this.getExpense(m.created_at).subscribe((r)=>{
          //     if(r.length>0)
          //      this.dataSource.data['expense'] =  r.expense;
          //   })
          // })
          this.dataSource.data = this.summary;

          console.log(this.summary)
        },
        (err)=>console.log(err))
  }
  //check permission
  hasPermission(val: any) {
    return this.storexService.hasPermission(val);
  }
}
