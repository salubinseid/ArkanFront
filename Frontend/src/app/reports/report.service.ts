import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getSummaryReport(data: any) {
    return this.http.post(`${environment.baseURL}/reports/summary`, data);
  }

  //get report by category and date range

  getReportByCategory(data: any) {
    return this.http.post(
      environment.baseURL + '/reports/custom/bycategory',
      data
    );
  }

  //get daily report
  getDailyReport(data: any) {
    return this.http.post(environment.baseURL + '/reports/daily', data);
  }
}
