import { Component, OnInit } from '@angular/core';
import { ReportService } from './report.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-custom.component.css'],
})
export class ReportDetailComponent implements OnInit {
  reports: any;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // this.reportService.getSummaryReport(null).subscribe((res)=>{
    //   this.reports = res;
    // },
    // (error)=>console.log(error))
  }
}
